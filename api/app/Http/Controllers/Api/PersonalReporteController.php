<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Cita;
use App\Models\Pqr;
use App\Models\HistorialReporte;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class PersonalReporteController extends Controller
{
    /**
     * Devuelve las consultas filtradas sin generar el PDF, 
     * ideal para la previsualización en la tabla del frontend.
     */
    public function index(Request $request, $entity)
    {
        $data = $this->getQueryData($request, $entity);
        return response()->json($data);
    }

    /**
     * Genera el PDF con los filtros aplicados y guarda el 
     * registro en historial_reportes.
     */
    public function export(Request $request, $entity)
    {
        try {
            ini_set('memory_limit', '512M');
            set_time_limit(300);
            
            $data = $this->getQueryData($request, $entity, false);

            // Guardar en historial_reportes con manejo de errores para evitar romper el flujo del PDF
            $usuario = Auth::guard('sanctum')->user();
            if ($usuario instanceof \App\Models\Usuario && $usuario->id_rol === 4) {
                $usuario->load(['especialidad']);
            }

            try {
                if ($usuario) {
                    $ejemplo = [];
                    if (count($data) > 0) {
                        $first = $data[0];
                        // Usar getAttributes() para guardar solo las columnas de la tabla base, 
                        // evitando cargar todas las relaciones configuradas con 'with'.
                        $cleanArray = is_object($first) && method_exists($first, 'getAttributes')
                            ? $first->getAttributes()
                            : (is_object($first) && method_exists($first, 'toArray') ? $first->toArray() : (array) $first);

                        // Doble limpieza para asegurar que sea JSON puro sin caracteres nulos de objetos protegidos
                        $ejemplo = json_decode(json_encode($cleanArray), true);

                        // Quitar metadatos de Eloquent que puedan haber quedado
                        unset($ejemplo['connection'], $ejemplo['table'], $ejemplo['primaryKey'], $ejemplo['wasRecentlyCreated'], $ejemplo['exists']);
                    }

                    HistorialReporte::create([
                        'id_usuario'       => $usuario->documento,
                        'tabla_relacion'   => $entity,
                        'num_registros'    => count($data),
                        'ejemplo_registro' => $ejemplo
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error("Error en HistorialReporte: " . $e->getMessage());
            }

            // Determinar la vista. Si es Médico (rol 4) y entidad citas, usar su propia plantilla
            $view = 'reports.personal.reporte_dinamico';
            $orientation = 'landscape';

            if ($usuario && $usuario->id_rol === 4 && $entity === 'citas') {
                $view = 'reports.medico.reporte_citas';
                $orientation = 'landscape';
            }

            $logoBase64 = '';
            try {
                if (file_exists(public_path('icono.png'))) {
                    $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
                }
            } catch (\Exception $e) {
                \Log::error("Error encoding logo for PDF (Personal): " . $e->getMessage());
            }

            // Preparar vista
            $pdf = Pdf::loadView($view, [
                'entity'   => $entity,
                'data'     => $data,
                'filters'  => $request->all(),
                'generado' => $usuario ? ($usuario->primer_nombre . ' ' . $usuario->primer_apellido) : 'Sistema Sanitec',
                'especialidad' => ($usuario && $usuario->id_rol === 4) ? ($usuario->especialidad->especialidad ?? 'Médico General') : null,
                'fecha'    => Carbon::now()->format('d/m/Y h:i A'),
                'logoBase64' => $logoBase64
            ])->setPaper('a4', $orientation);

            return $pdf->download("reporte_{$entity}_" . time() . ".pdf");
        } catch (\Exception $e) {
            \Log::error("Error exportando reporte {$entity}: " . $e->getMessage());
            return response()->json(['error' => 'No se pudo generar el PDF: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Función interna para obtener la data filtrada según la entidad.
     */
    private function getQueryData(Request $request, $entity, $paginate = true)
    {
        $query = null;

        if ($entity === 'pacientes') {
            $query = Usuario::where('id_rol', 5)->with(['estado', 'tipoDocumento']);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('documento', 'ILIKE', "%{$search}%")
                        ->orWhere('primer_nombre', 'ILIKE', "%{$search}%")
                        ->orWhere('segundo_nombre', 'ILIKE', "%{$search}%")
                        ->orWhere('primer_apellido', 'ILIKE', "%{$search}%")
                        ->orWhere('segundo_apellido', 'ILIKE', "%{$search}%")
                        ->orWhere('email', 'ILIKE', "%{$search}%");
                });
            }
            if ($request->filled('id_estado')) {
                $query->where('id_estado', $request->id_estado);
            }
        } elseif ($entity === 'citas') {
            $query = Cita::with([
                'estado',
                'paciente',
                'medico',
                'especialidad',
                'motivoConsulta',
                'historialDetalle.enfermedades'
            ]);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->whereHas('paciente', function ($q2) use ($search) {
                        $q2->where('primer_nombre', 'ILIKE', "%{$search}%")
                            ->orWhere('primer_apellido', 'ILIKE', "%{$search}%")
                            ->orWhere('documento', 'ILIKE', "%{$search}%");
                    })
                        ->orWhereHas('medico', function ($q3) use ($search) {
                            $q3->where('primer_nombre', 'ILIKE', "%{$search}%")
                                ->orWhere('primer_apellido', 'ILIKE', "%{$search}%");
                        });
                });
            }
            if ($request->filled('id_estado')) {
                $query->where('id_estado', $request->id_estado);
            }
            if ($request->filled('id_medico')) {
                $query->where('doc_medico', $request->id_medico);
            }
            if ($request->filled('id_especialidad')) {
                $query->where('id_especialidad', $request->id_especialidad);
            }
            if ($request->filled('id_motivo')) {
                $query->where('id_motivo', $request->id_motivo);
            }
            if ($request->filled('date_from')) {
                $query->whereDate('fecha', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->whereDate('fecha', '<=', $request->date_to);
            }

            // Filtro específico para Citas Atendidas (id_estado = 10) y Diagnóstico
            if ($request->filled('id_estado') && $request->id_estado == 10 && $request->filled('codigo_icd')) {
                $query->whereHas('historialDetalle.enfermedades', function ($q) use ($request) {
                    $q->where('enfermedades.codigo_icd', $request->codigo_icd);
                });
            }

            // SEGURIDAD: Si el usuario es Médico (rol 4), solo puede ver sus propias citas
            $user = Auth::guard('sanctum')->user();
            if ($user && $user->id_rol === 4) {
                $query->where('doc_medico', $user->documento);
            }
        } elseif ($entity === 'pqrs') {
            $query = Pqr::with('estado');

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nombre_usuario', 'ILIKE', "%{$search}%")
                        ->orWhere('asunto', 'ILIKE', "%{$search}%");
                });
            }
            if ($request->filled('id_estado')) {
                $query->where('id_estado', $request->id_estado);
            }
            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }
            // Sorting by id to compensate lack of created_at column if applicable
            $query->orderBy('id_pqr', 'desc');
        } else {
            return collect([]);
        }

        // Apply fallback ordering if created_at doesn't exist for some models. 
        // For Usuario and Cita, created_at should exist. 
        if ($entity !== 'pqrs') {
            $query->latest();
        }

        if ($paginate) {
            return $query->paginate($request->get('limit', 15));
        }

        return $query->get();
    }
}
