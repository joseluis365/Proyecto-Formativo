<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Receta;
use App\Models\RecetaDetalle;

class RecetaFarmaciaController extends Controller
{
    /**
     * Lista las recetas que tienen medicamentos asignados a la farmacia del usuario.
     * Solo muestra recetas vigentes (no vencidas, estado activo).
     * Cada receta en la lista incluye los detalles asignados a ESTA farmacia.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $farmacia = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        if (!$farmacia) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $nitFarmacia = $farmacia->nit;

        // Buscar detalles de receta asignados a esta farmacia que aún no han sido dispensados
        $query = RecetaDetalle::with([
            'receta.estado',
            'receta.historialDetalle.cita',
            'presentacion.medicamento',
            'presentacion.concentracion',
            'presentacion.formaFarmaceutica',
            'dispensacion',
        ])->where('nit_farmacia', $nitFarmacia)
          ->whereDoesntHave('dispensacion') // No dispensados aún
          ->whereHas('receta', function ($q) {
              $q->where('fecha_vencimiento', '>=', now()->toDateString());
          });

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('presentacion.medicamento', function ($q) use ($search) {
                $q->where('nombre', 'ILIKE', '%' . $search . '%');
            })->orWhereHas('receta', function ($q) use ($search) {
                $q->where('id_receta', 'ILIKE', '%' . $search . '%');
            });
        }

        $detalles = $query->orderByDesc('created_at')->paginate(15);

        return response()->json([
            'nit_farmacia' => $nitFarmacia,
            'data' => $detalles->map(function ($d) {
                $receta = $d->receta;
                $p      = $d->presentacion;
                $cita   = $receta?->historialDetalle?->cita;

                // Paciente: doc_paciente de la cita
                $pacienteNombre = 'N/A';
                if ($cita) {
                    $paciente = \App\Models\Usuario::find($cita->doc_paciente);
                    $pacienteNombre = $paciente ? ($paciente->primer_nombre . ' ' . $paciente->primer_apellido) : 'N/A';
                }

                return [
                    'id_detalle_receta' => $d->id_detalle_receta,
                    'id_receta'         => $d->id_receta,
                    'paciente'          => $pacienteNombre,
                    'medicamento'       => ($p->medicamento->nombre ?? '') . ' ' . ($p->concentracion->concentracion ?? '') . ' (' . ($p->formaFarmaceutica->forma_farmaceutica ?? '') . ')',
                    'dosis'             => $d->dosis,
                    'frecuencia'        => $d->frecuencia,
                    'duracion'          => $d->duracion,
                    'observaciones'     => $d->observaciones,
                    'fecha_vencimiento' => $receta?->fecha_vencimiento,
                    'estado_receta'     => $receta?->estado?->nombre_estado ?? 'N/A',
                ];
            }),
            'total'        => $detalles->total(),
            'per_page'     => $detalles->perPage(),
            'current_page' => $detalles->currentPage(),
            'last_page'    => $detalles->lastPage(),
        ]);
    }

    /**
     * Obtiene una receta específica y sus ítems asignados a la farmacia actual.
     * Usado para la acción "Atender Orden" desde el Dashboard/Movimientos.
     */
    public function show(Request $request, $id_receta)
    {
        $user = $request->user();
        $farmaciaQuery = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        if (!$farmaciaQuery) {
            return response()->json(['message' => 'No se encontró farmacia activa'], 404);
        }

        $nitFarmacia = $farmaciaQuery->nit;

        $receta = Receta::with([
            'estado',
            'historialDetalle.cita',
            'detalles' => function($q) use ($nitFarmacia) {
                $q->where('nit_farmacia', $nitFarmacia)
                  ->with([
                      'presentacion.medicamento', 
                      'presentacion.concentracion', 
                      'presentacion.formaFarmaceutica',
                      'dispensacion'
                  ]);
            }
        ])->find($id_receta);

        if (!$receta) {
            return response()->json(['message' => 'Receta no encontrada'], 404);
        }

        if ($receta->detalles->isEmpty()) {
            return response()->json(['message' => 'Esta receta no tiene medicamentos asignados a esta farmacia'], 404);
        }

        $cita = $receta->historialDetalle->cita ?? null;
        $pacienteNombre = 'N/A';
        $docPaciente = 'N/A';
        if ($cita) {
            $paciente = \App\Models\Usuario::find($cita->doc_paciente);
            if ($paciente) {
                $pacienteNombre = $paciente->primer_nombre . ' ' . $paciente->primer_apellido;
                $docPaciente = $paciente->documento;
            }
        }

        $items = $receta->detalles->map(function ($d) {
            $p = $d->presentacion;
            $yaDispensado = $d->dispensacion()->exists();
            return [
                'id_detalle_receta' => $d->id_detalle_receta,
                'id_presentacion'   => $d->id_presentacion,
                'medicamento'       => ($p->medicamento->nombre ?? '') . ' ' . ($p->concentracion->concentracion ?? '') . ' (' . ($p->formaFarmaceutica->forma_farmaceutica ?? '') . ')',
                'dosis'             => $d->dosis,
                'frecuencia'        => $d->frecuencia,
                'duracion'          => $d->duracion,
                'observaciones'     => $d->observaciones,
                'cantidad_recetada' => $d->cantidad_dispensar,
                'dispensado'        => $yaDispensado,
            ];
        });

        return response()->json([
            'id_receta'         => $receta->id_receta,
            'fecha_emision'     => $receta->created_at->format('Y-m-d'),
            'fecha_vencimiento' => $receta->fecha_vencimiento,
            'estado_receta'     => $receta->estado->nombre_estado ?? 'N/A',
            'paciente_nombre'   => $pacienteNombre,
            'paciente_doc'      => $docPaciente,
            'items'             => $items,
        ]);
    }
}
