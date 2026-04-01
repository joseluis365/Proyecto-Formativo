<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmpresaLicencia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Controlador de graficas de licencias.
 * Construye datos para visualizaciones de estado y vigencia de licencias.
 */
class LicenciaChartController extends Controller
{
    public function getMonthlyStats()
    {
        Carbon::setLocale('es');
        
        $now = Carbon::now();
        $mesActualNombre = strtolower($now->monthName);
        $mesAnteriorNombre = strtolower($now->copy()->subMonth()->monthName);
        
        $currentMonth = $now->month;
        $prevMonth = $now->copy()->subMonth()->month;
        $year = $now->year;

        // Calculamos la semana actual del mes para limitar el eje X dinámicamente
        // Usamos la misma lógica que en la consulta SQL para consistencia
        $primerDiaMes = $now->copy()->startOfMonth();
        $semanaActual = $now->weekOfYear - $primerDiaMes->weekOfYear + 1;
        
        // Si el resultado es negativo (raro pero posible en cambio de año), ajustamos
        if ($semanaActual <= 0) $semanaActual = 1;

        // Consulta adaptada para PostgreSQL
        // Solo traemos las semanas hasta la actual
        $stats = EmpresaLicencia::select(
            DB::raw("EXTRACT(WEEK FROM created_at) - EXTRACT(WEEK FROM DATE_TRUNC('month', created_at)) + 1 as semana"),
            DB::raw("SUM(CASE WHEN EXTRACT(MONTH FROM created_at) = $currentMonth THEN 1 ELSE 0 END) as actual"),
            DB::raw("SUM(CASE WHEN EXTRACT(MONTH FROM created_at) = $prevMonth THEN 1 ELSE 0 END) as anterior")
        )
        ->whereYear('created_at', $year)
        ->whereIn(DB::raw("EXTRACT(MONTH FROM created_at)"), [$currentMonth, $prevMonth])
        ->groupBy('semana')
        ->orderBy('semana')
        ->get();

        $formattedData = [];
        
        // Generamos todas las semanas desde la 1 hasta la actual
        for ($i = 1; $i <= $semanaActual; $i++) {
            $weekStat = $stats->firstWhere('semana', $i);
            
            $formattedData[] = [
                'name' => "Semana " . $i,
                $mesActualNombre => $weekStat ? (int)$weekStat->actual : 0,
                $mesAnteriorNombre => $weekStat ? (int)$weekStat->anterior : 0,
            ];
        }

        return response()->json([
            'mesActual' => $mesActualNombre,
            'mesAnterior' => $mesAnteriorNombre,
            'data' => $formattedData,
            'semanaActual' => $semanaActual
        ]);
    }
}
