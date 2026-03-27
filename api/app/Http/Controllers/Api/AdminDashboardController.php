<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Cita;
use App\Models\Pqr;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Devuelve las 4 estadísticas para las tarjetas del dash admin normal.
     * Cada stat incluye valor actual, porcentaje de cambio vs. mes anterior y type (positive|negative|neutral).
     */
    public function getStats()
    {
        $now          = Carbon::now();
        $startCurrent = $now->copy()->startOfMonth();
        $endCurrent   = $now->copy()->endOfMonth();
        $startPrev    = $now->copy()->subMonth()->startOfMonth();
        $endPrev      = $now->copy()->subMonth()->endOfMonth();

        // ─────────────────────────────────────────────
        // 1. MÉDICOS ACTIVOS  (id_rol = 4, id_estado = 1)
        // ─────────────────────────────────────────────
        $medicosActivos     = Usuario::where('id_rol', 4)->where('id_estado', 1)->count();
        $medicosAnterior    = Usuario::where('id_rol', 4)
            ->where('id_estado', 1)
            ->whereDate('created_at', '<=', $endPrev)
            ->count();

        // ─────────────────────────────────────────────
        // 2. PACIENTES ACTIVOS  (id_rol = 5, id_estado = 1)
        // ─────────────────────────────────────────────
        $pacientesActivos   = Usuario::where('id_rol', 5)->where('id_estado', 1)->count();
        $pacientesAnterior  = Usuario::where('id_rol', 5)
            ->where('id_estado', 1)
            ->whereDate('created_at', '<=', $endPrev)
            ->count();

        // ─────────────────────────────────────────────
        // 3. CITAS DEL MES  (mes actual)
        // ─────────────────────────────────────────────
        $citasMes           = Cita::whereBetween('fecha', [$startCurrent, $endCurrent])->count();
        $citasMesAnterior   = Cita::whereBetween('fecha', [$startPrev, $endPrev])->count();

        // ─────────────────────────────────────────────
        // 4. PERSONAL ACTIVO  (id_rol = 3, id_estado = 1)
        // ─────────────────────────────────────────────
        $personalActivo     = Usuario::where('id_rol', 3)->where('id_estado', 1)->count();
        $personalAnterior   = Usuario::where('id_rol', 3)
            ->where('id_estado', 1)
            ->whereDate('created_at', '<=', $endPrev)
            ->count();

        

        return response()->json([
            $this->buildStat('Médicos Activos',   'stethoscope',   $medicosActivos,   $medicosAnterior),
            $this->buildStat('Pacientes Activos',  'personal_injury', $pacientesActivos, $pacientesAnterior),
            $this->buildStat('Citas del Mes',      'calendar_month',  $citasMes,         $citasMesAnterior),
            $this->buildStat('Personal Activo',    'badge',          $personalActivo,   $personalAnterior),
            
        ]);
    }

    /**
     * Construye un objeto stat con variación porcentual.
     */
    private function buildStat(string $title, string $icon, int $current, int $previous): array
    {
        if ($previous === 0) {
            $pct  = $current > 0 ? 100 : 0;
            $type = $current > 0 ? 'positive' : 'neutral';
        } else {
            $pct  = round((($current - $previous) / $previous) * 100, 1);
            $type = $pct >= 0 ? 'positive' : 'negative';
        }

        $sign   = $pct >= 0 ? '+' : '';
        $change = "{$sign}{$pct}% vs mes anterior";

        return [
            'title'  => $title,
            'icon'   => $icon,
            'value'  => $current,
            'change' => $change,
            'type'   => $type,
        ];
    }

    /**
     * Devuelve los datos para el gráfico de órdenes médicas por mes.
     */
    public function getOrdenesMes()
    {
        $now          = Carbon::now();
        $startCurrent = $now->copy()->startOfMonth();
        $endCurrent   = $now->copy()->endOfMonth();
        $startPrev    = $now->copy()->subMonth()->startOfMonth();
        $endPrev      = $now->copy()->subMonth()->endOfMonth();

        // ─────────────────────────────────────────────
        // 1. REMISIONES A ESPECIALISTAS (Remision)
        // ─────────────────────────────────────────────
        $remisionesMes = \App\Models\Remision::whereBetween('created_at', [$startCurrent, $endCurrent])->count();
        $remisionesAnterior = \App\Models\Remision::whereBetween('created_at', [$startPrev, $endPrev])->count();

        // ─────────────────────────────────────────────
        // 2. EXÁMENES REMITIDOS (Examen)
        // ─────────────────────────────────────────────
        $examenesMes = \App\Models\Examen::whereBetween('created_at', [$startCurrent, $endCurrent])->count();
        $examenesAnterior = \App\Models\Examen::whereBetween('created_at', [$startPrev, $endPrev])->count();

        // ─────────────────────────────────────────────
        // 3. RECETAS DE MEDICAMENTOS (Receta)
        // ─────────────────────────────────────────────
        $recetasMes = \App\Models\Receta::whereBetween('created_at', [$startCurrent, $endCurrent])->count();
        $recetasAnterior = \App\Models\Receta::whereBetween('created_at', [$startPrev, $endPrev])->count();

        // ─────────────────────────────────────────────
        // TOTALES Y DIFERENCIA
        // ─────────────────────────────────────────────
        $totalMes = $remisionesMes + $examenesMes + $recetasMes;
        $totalAnterior = $remisionesAnterior + $examenesAnterior + $recetasAnterior;

        if ($totalAnterior === 0) {
            $pct = $totalMes > 0 ? 100 : 0;
        } else {
            $pct = round((($totalMes - $totalAnterior) / $totalAnterior) * 100, 1);
        }

        return response()->json([
            'total'      => $totalMes,
            'diferencia' => $pct,
            'mes'        => ucfirst($now->locale('es')->isoFormat('MMMM')),
            'data'       => [
                ['name' => 'Remisiones a especialistas', 'value' => $remisionesMes],
                ['name' => 'Exámenes remitidos',         'value' => $examenesMes],
                ['name' => 'Recetas de medicamentos',    'value' => $recetasMes],
            ]
        ]);
    }
}
