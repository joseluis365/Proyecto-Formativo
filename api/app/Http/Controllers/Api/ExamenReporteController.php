<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Examen;
use App\Models\HistorialReporte;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

/**
 * Controlador de reportes de examenes.
 * Genera listados e indicadores sobre examenes clinicos.
 */
class ExamenReporteController extends Controller
{
    /**
     * Devuelve las consultas filtradas sin generar el PDF, 
     * ideal para la previsualización en la tabla del frontend.
     */
    public function index(Request $request, $entity)
    {
        $payload = $this->getQueryData($request, $entity, true);
        return response()->json($payload);
    }

    /**
     * Genera el PDF con los filtros aplicados y guarda el 
     * registro en historial_reportes.
     */
    public function export(Request $request, $entity)
    {
        try {
            $payload = $this->getQueryData($request, $entity, false);
            $data = $payload['data'];

            $usuario = Auth::guard('sanctum')->user();

            // Guardar en historial_reportes
            try {
                if ($usuario) {
                    $ejemplo = [];
                    if (count($data) > 0) {
                        $first = $data[0];
                        // Limpieza para asegurar JSON puro
                        $cleanArray = is_object($first) && method_exists($first, 'toArray')
                            ? $first->toArray()
                            : (array) $first;

                        $ejemplo = json_decode(json_encode($cleanArray), true);
                        unset($ejemplo['connection'], $ejemplo['table'], $ejemplo['primaryKey'], $ejemplo['wasRecentlyCreated'], $ejemplo['exists']);
                    }

                    HistorialReporte::create([
                        'id_usuario'       => $usuario->documento,
                        'tabla_relacion'   => 'Exámenes Clínicos (' . $entity . ')',
                        'num_registros'    => count($data),
                        'ejemplo_registro' => $ejemplo
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error("Error en HistorialReporte (Exámenes): " . $e->getMessage());
            }

            // Preparar PDF
            $pdf = Pdf::loadView('reports.personal.reporte_dinamico', [
                'entity'   => $entity,
                'data'     => $data, // Ya vienen mapeados desde getQueryData
                'columns'  => $payload['meta']['columns'],
                'filters'  => $request->all(),
                'generado' => $usuario ? ($usuario->primer_nombre . ' ' . $usuario->primer_apellido) : 'Sistema Sanitec',
                'fecha'    => Carbon::now()->format('d/m/Y H:iA'),
            ])->setPaper('a4', 'landscape');

            return $pdf->download("reporte_examenes_" . time() . ".pdf");
        } catch (\Exception $e) {
            \Log::error("Error exportando reporte de exámenes: " . $e->getMessage());
            return response()->json(['error' => 'No se pudo generar el PDF: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Función interna para obtener la data filtrada.
     */
    private function getQueryData(Request $request, $entity, $paginate = true)
    {
        $columns = [
            'id_examen'     => 'ID',
            'fecha'         => 'Fecha',
            'tipo_examen'   => 'Categoría',
            'nombre_examen' => 'Examen',
            'paciente'      => 'Paciente',
            'estado'        => 'Estado',
            'archivo'       => 'Resultado'
        ];

        $title = "Reporte de Exámenes Clínicos";

        $query = Examen::with([
            'paciente',
            'categoriaExamen',
            'estado'
        ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'ILIKE', "%{$search}%")
                    ->orWhereHas('paciente', function ($q2) use ($search) {
                        $q2->where('primer_nombre', 'ILIKE', "%{$search}%")
                            ->orWhere('primer_apellido', 'ILIKE', "%{$search}%")
                            ->orWhere('documento', 'ILIKE', "%{$search}%");
                    });
            });
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('fecha', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('fecha', '<=', $request->date_to);
        }

        $query->orderBy('fecha', 'desc');

        if ($paginate) {
            $perPage = $request->get('limit', 15);
            $paginated = $query->paginate($perPage);

            // Transformar la data para el frontend
            $transformedData = $this->mapDataForReport($paginated->getCollection());

            return [
                'entity'       => $entity,
                'report_title' => $title,
                'meta'         => [
                    'columns'    => $columns,
                    'exportable' => ['pdf'],
                ],
                'data'         => $transformedData,
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'last_page'    => $paginated->lastPage(),
                'current_page' => $paginated->currentPage()
            ];
        }

        $allData = $query->get();
        return [
            'entity'       => $entity,
            'report_title' => $title,
            'meta'         => [
                'columns'    => $columns,
                'exportable' => ['pdf'],
            ],
            'data'         => $this->mapDataForReport($allData)
        ];
    }

    /**
     * Mapea los modelos a un formato amigable para la tabla dinámica del frontend y el PDF.
     */
    private function mapDataForReport($collection)
    {
        return $collection->map(function ($e) {
            // Extraer solo el nombre del archivo si existe
            $nombreArchivo = $e->resultado_pdf ? basename($e->resultado_pdf) : 'N/A';

            return (object)[
                'id_examen'     => $e->id_examen,
                'fecha'         => $e->fecha ? Carbon::parse($e->fecha)->format('d/m/Y') : 'N/A',
                'tipo_examen'   => $e->categoriaExamen->categoria ?? 'General',
                'nombre_examen' => $e->nombre,
                'paciente'      => $e->paciente ? ($e->paciente->primer_nombre . ' ' . $e->paciente->primer_apellido) : 'N/A',
                'estado'        => $e->estado->nombre_estado ?? 'N/A',
                'archivo'       => $nombreArchivo,
                'id_estado'     => $e->id_estado
            ];
        });
    }
}
