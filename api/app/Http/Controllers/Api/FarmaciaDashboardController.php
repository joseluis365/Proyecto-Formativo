<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoteMedicamento;
use App\Models\InventarioFarmacia;
use App\Models\MovimientoInventario;
use Carbon\Carbon;

class FarmaciaDashboardController extends Controller
{
    /**
     * Estadísticas del dashboard de la farmacia del usuario autenticado.
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $farmacia = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        if (!$farmacia) {
            return response()->json([
                'nit_farmacia'          => null,
                'nombre_farmacia'       => 'Sin farmacia asignada',
                'lotes_vencidos'        => 0,
                'lotes_proximos_vencer' => 0,
                'items_stock_bajo'      => 0,
                'movimientos_recientes' => [],
                'proximos_vencer'       => [],
            ]);
        }

        $nitFarmacia = $farmacia->nit;
        $hoy = Carbon::today();
        $en30Dias = Carbon::today()->addDays(30);

        // Lotes vencidos con stock > 0
        $lotesVencidos = LoteMedicamento::where('nit_farmacia', $nitFarmacia)
            ->where('fecha_vencimiento', '<', $hoy->toDateString())
            ->where('stock_actual', '>', 0)
            ->count();

        // Lotes que vencen en los próximos 30 días con stock > 0
        $lotesProximosVencer = LoteMedicamento::where('nit_farmacia', $nitFarmacia)
            ->whereBetween('fecha_vencimiento', [$hoy->toDateString(), $en30Dias->toDateString()])
            ->where('stock_actual', '>', 0)
            ->count();

        // Ítems de inventario con stock <= 20 (umbral bajo)
        $stockBajo = InventarioFarmacia::where('nit_farmacia', $nitFarmacia)
            ->where('stock_actual', '>', 0)
            ->where('stock_actual', '<=', 20)
            ->count();

        // Últimos 5 movimientos de la farmacia
        $movimientos = MovimientoInventario::with([
            'loteMedicamento.presentacion.medicamento',
            'loteMedicamento.presentacion.concentracion',
        ])->whereHas('loteMedicamento', function ($q) use ($nitFarmacia) {
            $q->where('nit_farmacia', $nitFarmacia);
        })->orderByDesc('created_at')->take(5)->get();

        // Lotes próximos a vencer para la lista del dashboard
        $proximos = LoteMedicamento::with([
            'presentacion.medicamento',
            'presentacion.concentracion',
            'presentacion.formaFarmaceutica',
        ])->where('nit_farmacia', $nitFarmacia)
          ->where('stock_actual', '>', 0)
          ->whereBetween('fecha_vencimiento', [$hoy->toDateString(), $en30Dias->toDateString()])
          ->orderBy('fecha_vencimiento', 'asc')
          ->take(5)
          ->get();

        return response()->json([
            'nit_farmacia'          => $nitFarmacia,
            'nombre_farmacia'       => $farmacia->nombre,
            'lotes_vencidos'        => $lotesVencidos,
            'lotes_proximos_vencer' => $lotesProximosVencer,
            'items_stock_bajo'      => $stockBajo,
            'movimientos_recientes' => $movimientos->map(function ($m) use ($hoy) {
                $lote = $m->loteMedicamento;
                $p    = $lote?->presentacion;
                $fecha = Carbon::parse($m->fecha ?? $m->created_at);
                $esHoy = $fecha->isToday();
                $esAyer = $fecha->isYesterday();

                return [
                    'tipo'       => $m->tipo_movimiento,
                    'medicamento'=> ($p?->medicamento->nombre ?? '') . ' ' . ($p?->concentracion->concentracion ?? ''),
                    'cantidad'   => $m->cantidad,
                    'tiempo'     => $esHoy ? $fecha->format('h:i A') : ($esAyer ? 'Ayer' : $fecha->format('d/m')),
                ];
            }),
            'proximos_vencer' => $proximos->map(function ($lote) use ($hoy) {
                $p   = $lote->presentacion;
                $dias = $hoy->diffInDays(Carbon::parse($lote->fecha_vencimiento), false);
                return [
                    'id_lote'          => $lote->id_lote,
                    'medicamento'      => ($p?->medicamento->nombre ?? '') . ' ' . ($p?->concentracion->concentracion ?? ''),
                    'forma'            => $p?->formaFarmaceutica->forma_farmaceutica ?? '',
                    'stock'            => $lote->stock_actual,
                    'fecha_vencimiento'=> $lote->fecha_vencimiento,
                    'dias_vencimiento' => $dias,
                ];
            }),
        ]);
    }
}
