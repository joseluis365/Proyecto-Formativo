<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Exception;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Obtiene los datos de un reporte dinámico para una entidad.
     */
    public function index(Request $request, string $entity)
    {
        try {
            $data = $this->reportService->getData($entity, $request->all());
            return response()->json($data);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => 'Entidad no encontrada',
                'message' => $e->getMessage()
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error al generar el reporte',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporta los datos de un reporte dinámico en formato PDF.
     */
    public function export(Request $request, string $entity)
    {
        try {
            $pdf = $this->reportService->export($entity, $request->all(), 'pdf');
            $filename = "reporte_{$entity}_" . now()->format('Ymd_His') . ".pdf";
            
            return $pdf->stream($filename);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => 'Error de validación', 'message' => $e->getMessage()], 400);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error al exportar PDF', 'message' => $e->getMessage()], 500);
        }
    }
}
