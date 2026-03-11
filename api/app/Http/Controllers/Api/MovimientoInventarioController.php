<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MovimientoInventario;
use App\Models\LoteMedicamento;
use App\Models\InventarioFarmacia;
use App\Http\Requests\Farmacia\StoreSalidaManualRequest;
use Illuminate\Support\Facades\DB;

class MovimientoInventarioController extends Controller
{
    /**
     * Historial de movimientos de la farmacia del usuario autenticado.
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

        // Movimientos asociados a lotes de esta farmacia
        $query = MovimientoInventario::with([
            'loteMedicamento.presentacion.medicamento',
            'loteMedicamento.presentacion.concentracion',
            'loteMedicamento.presentacion.formaFarmaceutica',
            'usuarioDocumento',
            'dispensacion',
        ])->whereHas('loteMedicamento', function ($q) use ($nitFarmacia) {
            $q->where('nit_farmacia', $nitFarmacia);
        });

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('loteMedicamento.presentacion.medicamento', function ($q) use ($search) {
                $q->where('nombre', 'ILIKE', '%' . $search . '%');
            });
        }

        if ($request->filled('tipo')) {
            $tipo = $request->tipo;
            if ($tipo === 'ingresos') {
                $query->where('tipo_movimiento', 'Ingreso');
            } elseif ($tipo === 'salidas_manuales') {
                $query->where('tipo_movimiento', 'Salida')
                      ->whereNull('id_dispensacion');
            } elseif ($tipo === 'ordenes_medicas') {
                $query->where('tipo_movimiento', 'Salida')
                      ->whereNotNull('id_dispensacion');
            } else {
                $query->where('tipo_movimiento', $tipo);
            }
        }

        if ($request->filled('paciente')) {
            $paciente = strtolower($request->paciente);
            $query->whereHas('dispensacion.detalleReceta.receta.paciente', function ($q) use ($paciente) {
                $q->whereRaw("LOWER(CONCAT(primer_nombre, ' ', primer_apellido)) LIKE ?", ["%{$paciente}%"])
                  ->orWhere('documento', 'LIKE', "%{$paciente}%");
            });
        }

        $movimientos = $query->orderByDesc('fecha')->paginate(20);

        return response()->json([
            'data' => $movimientos->map(function ($m) {
                $lote = $m->loteMedicamento;
                $p    = $lote?->presentacion;
                $med  = $p?->medicamento;
                $resp = $m->usuarioDocumento;

                return [
                    'id_movimiento'   => $m->id_movimiento,
                    'tipo_movimiento' => $m->tipo_movimiento,
                    'medicamento'     => ($med->nombre ?? '') . ' ' . ($p?->concentracion->concentracion ?? '') . ' (' . ($p?->formaFarmaceutica->forma_farmaceutica ?? '') . ')',
                    'cantidad'        => $m->cantidad,
                    'fecha'           => $m->fecha,
                    'motivo'          => $m->motivo,
                    'responsable'     => $resp ? ($resp->primer_nombre . ' ' . $resp->primer_apellido) : 'N/A',
                    'id_dispensacion' => $m->id_dispensacion,
                    'lote_id'         => $lote?->id_lote,
                ];
            }),
            'total'        => $movimientos->total(),
            'per_page'     => $movimientos->perPage(),
            'current_page' => $movimientos->currentPage(),
            'last_page'    => $movimientos->lastPage(),
        ]);
    }

    /**
     * Registrar una salida manual de inventario (sin receta, por ej: ajuste o pérdida).
     */
    public function registrarSalida(StoreSalidaManualRequest $request)
    {
        $user  = $request->user();
        $lote  = LoteMedicamento::findOrFail($request->id_lote);

        if ($lote->stock_actual < $request->cantidad) {
            return response()->json([
                'message' => 'Validación fallida',
                'errors' => ['cantidad' => ['Stock insuficiente en el lote seleccionado']]
            ], 422);
        }

        DB::transaction(function () use ($request, $user, $lote) {
            // Descontar del lote
            $lote->decrement('stock_actual', $request->cantidad);

            // Descontar del inventario general
            InventarioFarmacia::where('nit_farmacia', $lote->nit_farmacia)
                ->where('id_presentacion', $lote->id_presentacion)
                ->decrement('stock_actual', $request->cantidad);

            // Registrar movimiento
            MovimientoInventario::create([
                'id_lote'        => $lote->id_lote,
                'tipo_movimiento'=> 'Salida',
                'cantidad'       => $request->cantidad,
                'fecha'          => now()->toDateString(),
                'documento'      => $user->documento,
                'motivo'         => $request->motivo,
            ]);
        });

        return response()->json(['message' => 'Salida registrada correctamente'], 201);
    }
}
