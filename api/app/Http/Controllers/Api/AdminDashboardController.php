<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Cita;
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
}
