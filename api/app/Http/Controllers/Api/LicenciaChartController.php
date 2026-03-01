<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmpresaLicencia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LicenciaChartController extends Controller
{
    public function getMonthlyStats()
{
    Carbon::setLocale('es');
    
    $now = Carbon::now();
    $mesActualNombre = strtolower($now->monthName);
    $mesAnteriorNombre = strtolower($now->subMonth()->monthName);
    
    $now = Carbon::now();
    $currentMonth = $now->month;
    $prevMonth = $now->copy()->subMonth()->month;
    $year = $now->year;

    // Consulta adaptada para PostgreSQL
    $stats = EmpresaLicencia::select(
        // Calcula la semana del mes en PostgreSQL
        DB::raw("EXTRACT(WEEK FROM created_at) - EXTRACT(WEEK FROM DATE_TRUNC('month', created_at)) + 1 as semana"),
        DB::raw("SUM(CASE WHEN EXTRACT(MONTH FROM created_at) = $currentMonth THEN 1 ELSE 0 END) as actual"),
        DB::raw("SUM(CASE WHEN EXTRACT(MONTH FROM created_at) = $prevMonth THEN 1 ELSE 0 END) as anterior")
    )
    ->whereYear('created_at', $year)
    ->groupBy('semana')
    ->orderBy('semana')
    ->get();

    $formattedData = $stats->map(function ($item) use ($mesActualNombre, $mesAnteriorNombre) {
        return [
            'name' => "Semana " . (int)$item->semana,
            $mesActualNombre => (int)$item->actual,
            $mesAnteriorNombre => (int)$item->anterior,
        ];
    });

    return response()->json([
        'mesActual' => $mesActualNombre,
        'mesAnterior' => $mesAnteriorNombre,
        'data' => $formattedData
    ]);
}
}
