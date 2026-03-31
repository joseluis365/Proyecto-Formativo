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
     * Inventario de la farmacia del usuario autenticado.
     * Devuelve UNA FILA POR LOTE (con stock > 0) para mostrar
     * todos los lotes separados en la vista. También incluye el
     * stock_total del medicamento (suma de lotes no vencidos).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $farmaciaQuery = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        $nitFarmaciaReal = $farmaciaQuery ? $farmaciaQuery->nit : $user->nit;

        $hoy = Carbon::today();

        // Obtener todos los lotes de esta farmacia con stock > 0
        $lotesQuery = LoteMedicamento::with([
            'presentacion.medicamento.categoriaMedicamento',
            'presentacion.concentracion',
            'presentacion.formaFarmaceutica',
        ])->where('nit_farmacia', $nitFarmaciaReal)
          ->where('stock_actual', '>', 0);

        $lotes = $lotesQuery->get();

        // Para cada medicamento (presentacion), calcular el stock total de lotes no vencidos
        $stockTotalPorPresentacion = LoteMedicamento::where('nit_farmacia', $nitFarmaciaReal)
            ->where('stock_actual', '>', 0)
            ->where('fecha_vencimiento', '>=', $hoy->toDateString())
            ->select('id_presentacion', DB::raw('SUM(stock_actual) as total'))
            ->groupBy('id_presentacion')
            ->pluck('total', 'id_presentacion');

        $mapped = $lotes->map(function ($lote) use ($hoy, $stockTotalPorPresentacion) {
            $p = $lote->presentacion;

            $diasVencimiento = $hoy->diffInDays(Carbon::parse($lote->fecha_vencimiento), false);

            $estadoStock = 'Normal';
            if ($diasVencimiento < 0) {
                $estadoStock = 'Vencido';
            } elseif ($diasVencimiento <= 30) {
                $estadoStock = 'Próximo';
            } elseif ($lote->stock_actual <= 20) {
                $estadoStock = 'Bajo';
            }

            $stockTotal = $stockTotalPorPresentacion[$lote->id_presentacion] ?? 0;

            return [
                'id_lote'          => $lote->id_lote,
                'id_presentacion'  => $lote->id_presentacion,
                'nombre'           => ($p->medicamento->nombre ?? ''),
                'id_forma'         => $p->id_forma_farmaceutica,
                'forma'            => $p->formaFarmaceutica->forma_farmaceutica ?? '',
                'id_concentracion' => $p->id_concentracion,
                'concentracion'    => $p->concentracion->concentracion ?? '',
                'categoria'        => $p->medicamento->categoriaMedicamento->categoria ?? '',
                'stock_lote'       => $lote->stock_actual,
                'stock_total'      => (int)$stockTotal,
                'fecha_vencimiento'=> $lote->fecha_vencimiento,
                'dias_vencimiento' => $diasVencimiento,
                'estado_stock'     => $estadoStock,
            ];
        });

        // 1. Filtrar por búsqueda
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $mapped = $mapped->filter(function ($item) use ($search) {
                return str_contains(strtolower($item['nombre']), $search)
                    || str_contains(strtolower($item['concentracion']), $search);
            });
        }

        // 2. Filtrar por forma farmacéutica
        if ($request->filled('id_forma')) {
            $mapped = $mapped->where('id_forma', $request->id_forma);
        }

        // 3. Filtrar por concentración
        if ($request->filled('id_concentracion')) {
            $mapped = $mapped->where('id_concentracion', $request->id_concentracion);
        }

        // 4. Filtrar por estado
        if ($request->filled('estado')) {
            $mapped = $mapped->where('estado_stock', $request->estado);
        }

        // 5. Ordenar: primero vencidos, luego por días de vencimiento ASC
        $mapped = $mapped->sort(function ($a, $b) {
            $da = $a['dias_vencimiento'];
            $db = $b['dias_vencimiento'];
            if ($da === null && $db === null) return 0;
            if ($da === null) return 1;
            if ($db === null) return -1;
            return $da <=> $db;
        })->values();

        // 6. Paginación manual
        $perPage = 15;
        $page    = $request->input('page', 1);
        $total   = $mapped->count();
        $paginated = $mapped->slice(($page - 1) * $perPage, $perPage)->values();

        return response()->json([
            'nit_farmacia' => $nitFarmaciaReal,
            'data'         => $paginated,
            'total'        => $total,
            'per_page'     => $perPage,
            'current_page' => (int)$page,
            'last_page'    => max(1, (int)ceil($total / $perPage)),
        ]);
    }

    /**
     * Lista todos los lotes con stock > 0 para el selector de Salida Manual.
     * Incluye nombre del medicamento, stock del lote, fecha de vencimiento e id_lote.
     */
    public function lotesDisponibles(Request $request)
    {
        $user = $request->user();
        $farmacia = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        if (!$farmacia) {
            return response()->json([]);
        }

        $lotes = LoteMedicamento::with([
            'presentacion.medicamento',
            'presentacion.concentracion',
            'presentacion.formaFarmaceutica',
        ])->where('nit_farmacia', $farmacia->nit)
          ->where('stock_actual', '>', 0)
          ->orderBy('fecha_vencimiento', 'asc')
          ->get();

        $hoy = Carbon::today();

        return response()->json(
            $lotes->map(function ($lote) use ($hoy) {
                $p = $lote->presentacion;
                $diasVencimiento = $hoy->diffInDays(Carbon::parse($lote->fecha_vencimiento), false);
                return [
                    'id_lote'          => $lote->id_lote,
                    'id_presentacion'  => $lote->id_presentacion,
                    'nombre'           => ($p->medicamento->nombre ?? '') . ' ' . ($p->concentracion->concentracion ?? '') . ' (' . ($p->formaFarmaceutica->forma_farmaceutica ?? '') . ')',
                    'stock_actual'     => $lote->stock_actual,
                    'fecha_vencimiento'=> $lote->fecha_vencimiento,
                    'dias_vencimiento' => $diasVencimiento,
                    'vencido'          => $diasVencimiento < 0,
                ];
            })->values()
        );
    }

    /**
     * Registra una entrada de medicamento (nuevo lote).
     * Siempre crea un lote nuevo; nunca modifica lotes existentes.
     * Actualiza el inventario general sumando el stock.
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
            // 1. Crear SIEMPRE un lote nuevo (nunca mezclar con lotes existentes)
            $lote = LoteMedicamento::create([
                'id_presentacion'   => $request->id_presentacion,
                'nit_farmacia'      => $farmacia->nit,
                'fecha_vencimiento' => $request->fecha_vencimiento,
                'stock_actual'      => $request->cantidad,
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
                'id_lote'         => $lote->id_lote,
                'tipo_movimiento' => 'Ingreso',
                'cantidad'        => $request->cantidad,
                'fecha'           => now()->toDateString(),
                'documento'       => $user->documento,
                'motivo'          => $request->motivo ?? 'Entrada de inventario',
                'nit_farmacia'    => $farmacia->nit,
            ]);
        });

        return response()->json(['message' => 'Entrada registrada correctamente'], 201);
    }

    /**
     * Farmacias con stock > 0 para una presentación dada.
     * Usado en la receta médica para saber dónde está disponible.
     */
    public function porPresentacion(int $idPresentacion)
    {
        $inventarios = InventarioFarmacia::with('farmacia')
            ->where('id_presentacion', $idPresentacion)
            ->where('stock_actual', '>', 0)
            ->orderBy('stock_actual', 'desc')
            ->get();

        $farmacias = $inventarios->map(fn($inv) => [
            'nit'       => $inv->nit_farmacia,
            'nombre'    => $inv->farmacia?->nombre ?? $inv->nit_farmacia,
            'direccion' => $inv->farmacia?->direccion ?? '',
            'stock'     => $inv->stock_actual,
        ])->values();

        return response()->json([
            'success' => true,
            'data'    => $farmacias
        ]);
    }
}
