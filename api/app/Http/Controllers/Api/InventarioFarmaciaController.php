<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InventarioFarmacia;
use App\Models\LoteMedicamento;
use App\Models\MovimientoInventario;
use App\Http\Requests\Farmacia\StoreMovimientoInventarioRequest;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventarioFarmaciaController extends Controller
{
    /**
     * Inventario actual de la farmacia del usuario autenticado.
     * Agrupa por presentación, muestra stock total y alerta de vencimiento.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $farmaciaQuery = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        $nitFarmaciaReal = $farmaciaQuery ? $farmaciaQuery->nit : $user->nit;

        $query = InventarioFarmacia::with([
            'presentacion.medicamento.categoriaMedicamento',
            'presentacion.concentracion',
            'presentacion.formaFarmaceutica',
        ])->where('nit_farmacia', $nitFarmaciaReal);

        // Fetch all items to compute derived attributes like dias_vencimiento and estadoStock
        $inventario = $query->get();
        $hoy = Carbon::today();

        $mapped = $inventario->map(function ($item) use ($hoy, $nitFarmaciaReal) {
            $p = $item->presentacion;
            
            // Lote más próximo a vencer con stock > 0 (FEFO)
            $loteProximo = LoteMedicamento::where('nit_farmacia', $nitFarmaciaReal)
                ->where('id_presentacion', $item->id_presentacion)
                ->where('stock_actual', '>', 0)
                ->orderBy('fecha_vencimiento', 'asc')
                ->first();

            $diasVencimiento = null;
            $estadoStock = 'Normal';

            if ($loteProximo) {
                $diasVencimiento = $hoy->diffInDays(Carbon::parse($loteProximo->fecha_vencimiento), false);
                if ($diasVencimiento < 0) $estadoStock = 'Vencido';
                elseif ($diasVencimiento <= 30) $estadoStock = 'Próximo';
            }

            if ($item->stock_actual <= 0) $estadoStock = 'Agotado';
            elseif ($item->stock_actual <= 20 && $estadoStock === 'Normal') $estadoStock = 'Bajo';

            return [
                'id_inventario'    => $item->id_inventario,
                'id_presentacion'  => $item->id_presentacion,
                'nombre'           => ($p->medicamento->nombre ?? ''),
                'id_forma'         => $p->id_forma_farmaceutica,
                'forma'            => $p->formaFarmaceutica->forma_farmaceutica ?? '',
                'id_concentracion' => $p->id_concentracion,
                'concentracion'    => $p->concentracion->concentracion ?? '',
                'categoria'        => $p->medicamento->categoriaMedicamento->categoria ?? '',
                'stock_actual'     => $item->stock_actual,
                'lote_id'          => $loteProximo?->id_lote,
                'fecha_vencimiento'=> $loteProximo?->fecha_vencimiento,
                'dias_vencimiento' => $diasVencimiento,
                'estado_stock'     => $estadoStock,
            ];
        });

        // 1. Filter by Search
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $mapped = $mapped->filter(function ($item) use ($search) {
                return str_contains(strtolower($item['nombre']), $search) || str_contains(strtolower($item['concentracion']), $search);
            });
        }

        // 2. Filter by forma
        if ($request->filled('id_forma')) {
            $mapped = $mapped->where('id_forma', $request->id_forma);
        }

        // 3. Filter by concentracion
        if ($request->filled('id_concentracion')) {
            $mapped = $mapped->where('id_concentracion', $request->id_concentracion);
        }

        // 4. Filter by estado (Vencido, Próximo, Bajo, Normal, Agotado)
        if ($request->filled('estado')) {
            $mapped = $mapped->where('estado_stock', $request->estado);
        }

        // 5. Sort by fastest expiring (dias_vencimiento ASC), nulls last
        $mapped = $mapped->sort(function ($a, $b) {
            $da = $a['dias_vencimiento'];
            $db = $b['dias_vencimiento'];
            if ($da === null && $db === null) return 0;
            if ($da === null) return 1;
            if ($db === null) return -1;
            return $da <=> $db;
        })->values();

        // 6. Manual Pagination
        $perPage = 15;
        $page = $request->input('page', 1);
        $total = $mapped->count();
        $paginated = $mapped->slice(($page - 1) * $perPage, $perPage)->values();

        return response()->json([
            'nit_farmacia' => $nitFarmaciaReal,
            'data'         => $paginated,
            'total'        => $total,
            'per_page'     => $perPage,
            'current_page' => (int)$page,
            'last_page'    => ceil($total / $perPage),
        ]);
    }

    /**
     * Registra una entrada de medicamento (nuevo lote).
     * Crea o actualiza el inventario general y registra el movimiento.
     */
    public function registrarEntrada(StoreMovimientoInventarioRequest $request)
    {
        $user = $request->user();
        $farmacia = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        if (!$farmacia) {
            return response()->json(['message' => 'No se encontró una farmacia asociada a tu cuenta'], 422);
        }

        DB::transaction(function () use ($request, $user, $farmacia) {
            // 1. Crear lote
            $lote = LoteMedicamento::create([
                'id_presentacion'  => $request->id_presentacion,
                'nit_farmacia'     => $farmacia->nit,
                'fecha_vencimiento'=> $request->fecha_vencimiento,
                'stock_actual'     => $request->cantidad,
            ]);

            // 2. Actualizar inventario general (sumar stock)
            $inventario = InventarioFarmacia::where('nit_farmacia', $farmacia->nit)
                ->where('id_presentacion', $request->id_presentacion)
                ->first();

            if ($inventario) {
                $inventario->increment('stock_actual', $request->cantidad);
            } else {
                InventarioFarmacia::create([
                    'nit_farmacia'    => $farmacia->nit,
                    'id_presentacion' => $request->id_presentacion,
                    'stock_actual'    => $request->cantidad,
                ]);
            }

            // 3. Registrar movimiento
            MovimientoInventario::create([
                'id_lote'        => $lote->id_lote,
                'tipo_movimiento'=> 'Ingreso',
                'cantidad'       => $request->cantidad,
                'fecha'          => now()->toDateString(),
                'documento'      => $user->documento,
                'motivo'         => $request->motivo ?? 'Entrada de inventario',
            ]);
        });

        return response()->json(['message' => 'Entrada registrada correctamente'], 201);
    }
}
