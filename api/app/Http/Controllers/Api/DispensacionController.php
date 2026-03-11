<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dispensacion;
use App\Models\RecetaDetalle;
use App\Models\LoteMedicamento;
use App\Models\InventarioFarmacia;
use App\Models\MovimientoInventario;
use App\Http\Requests\Farmacia\StoreDispensacionRequest;
use Illuminate\Support\Facades\DB;

class DispensacionController extends Controller
{
    /**
     * Dispensar un medicamento de una receta.
     *
     * Flujo:
     * 1. Valida que el detalle de receta exista, esté asignado a esta farmacia y no haya sido dispensado.
     * 2. Selecciona el lote FEFO (vence primero) con stock suficiente.
     * 3. Descuenta del lote y del inventario general.
     * 4. Crea la dispensación.
     * 5. Crea el movimiento de inventario tipo Salida vinculado a la dispensación.
     */
    public function dispensar(StoreDispensacionRequest $request)
    {
        $user = $request->user();
        $farmacia = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        if (!$farmacia) {
            return response()->json(['message' => 'No se encontró una farmacia asociada a tu cuenta'], 422);
        }

        $detalle = RecetaDetalle::with(['receta', 'dispensacion'])->findOrFail($request->id_detalle_receta);

        // Verificar que pertenece a esta farmacia
        if ($detalle->nit_farmacia !== $farmacia->nit) {
            return response()->json(['message' => 'Este medicamento no está asignado a tu farmacia'], 403);
        }

        // Verificar que aún no ha sido dispensado
        if ($detalle->dispensacion) {
            return response()->json(['message' => 'Este medicamento ya fue dispensado anteriormente'], 422);
        }

        // Verificar vigencia de la receta
        if ($detalle->receta->fecha_vencimiento < now()->toDateString()) {
            return response()->json(['message' => 'La receta está vencida'], 422);
        }

        // Buscar lote FEFO con stock suficiente
        $lote = LoteMedicamento::where('nit_farmacia', $farmacia->nit)
            ->whereHas('presentacion', function ($q) use ($detalle) {
                $q->where('id_presentacion', $detalle->id_presentacion);
            })
            ->where('stock_actual', '>=', $request->cantidad)
            ->where('fecha_vencimiento', '>=', now()->toDateString())
            ->orderBy('fecha_vencimiento', 'asc')
            ->first();

        if (!$lote) {
            return response()->json(['message' => 'Stock insuficiente de este medicamento en la farmacia'], 422);
        }

        DB::transaction(function () use ($request, $user, $farmacia, $detalle, $lote) {
            // 1. Crear dispensación
            $dispensacion = Dispensacion::create([
                'id_detalle_receta'       => $detalle->id_detalle_receta,
                'nit_farmacia'            => $farmacia->nit,
                'cantidad'                => $request->cantidad,
                'fecha_dispensacion'      => now(),
                'documento_farmaceutico'  => $user->documento,
                'id_estado'               => 1,
            ]);

            // 2. Descontar del lote
            $lote->decrement('stock_actual', $request->cantidad);

            // 3. Descontar del inventario general
            InventarioFarmacia::where('nit_farmacia', $farmacia->nit)
                ->where('id_presentacion', $detalle->id_presentacion)
                ->decrement('stock_actual', $request->cantidad);

            // 4. Registrar movimiento de inventario vinculado a la dispensación
            MovimientoInventario::create([
                'id_lote'         => $lote->id_lote,
                'tipo_movimiento' => 'Salida',
                'cantidad'        => $request->cantidad,
                'fecha'           => now()->toDateString(),
                'documento'       => $user->documento,
                'motivo'          => 'Dispensación de receta #' . $detalle->id_receta,
                'id_dispensacion' => $dispensacion->id_dispensacion,
            ]);
        });

        return response()->json(['message' => 'Dispensación registrada correctamente'], 201);
    }

    /**
     * Lista el historial de dispensaciones de la farmacia.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $farmacia = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        if (!$farmacia) {
            return response()->json(['data' => [], 'total' => 0]);
        }

        $dispensaciones = Dispensacion::with([
            'detalleReceta.presentacion.medicamento',
            'detalleReceta.presentacion.concentracion',
            'detalleReceta.presentacion.formaFarmaceutica',
            'farmaceutico',
            'estado',
        ])->where('nit_farmacia', $farmacia->nit)
          ->orderByDesc('fecha_dispensacion')
          ->paginate(15);

        return response()->json([
            'data' => $dispensaciones->map(function ($d) {
                $det = $d->detalleReceta;
                $p   = $det?->presentacion;

                return [
                    'id_dispensacion'     => $d->id_dispensacion,
                    'id_receta'           => $det?->id_receta,
                    'medicamento'         => ($p?->medicamento->nombre ?? '') . ' ' . ($p?->concentracion->concentracion ?? ''),
                    'cantidad'            => $d->cantidad,
                    'fecha_dispensacion'  => $d->fecha_dispensacion,
                    'farmaceutico'        => $d->farmaceutico ? ($d->farmaceutico->primer_nombre . ' ' . $d->farmaceutico->primer_apellido) : 'N/A',
                    'estado'              => $d->estado?->nombre_estado ?? 'N/A',
                ];
            }),
            'total'        => $dispensaciones->total(),
            'per_page'     => $dispensaciones->perPage(),
            'current_page' => $dispensaciones->currentPage(),
            'last_page'    => $dispensaciones->lastPage(),
        ]);
    }
}
