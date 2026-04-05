<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicamento;
use App\Models\Presentacion;
use App\Models\CategoriaMedicamento;
use App\Models\Concentracion;
use App\Models\FormaFarmaceutica;
use App\Models\Estado;

class MedicamentoController extends Controller
{
    /**
     * Lista todas las presentaciones con sus relaciones (medicamento, concentración, forma).
     * Esta es la vista principal del catálogo de farmacia.
     */
    public function index(Request $request)
    {
        $query = Presentacion::with([
            'medicamento.categoriaMedicamento',
            'medicamento.estado',
            'concentracion',
            'formaFarmaceutica',
        ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('medicamento', function ($q) use ($search) {
                $q->where('nombre', 'ILIKE', '%' . $search . '%');
            })->orWhereHas('concentracion', function ($q) use ($search) {
                $q->where('concentracion', 'ILIKE', '%' . $search . '%');
            });
        }

        if ($request->filled('id_estado')) {
            $query->whereHas('medicamento', function ($q) use ($request) {
                $q->where('id_estado', $request->id_estado);
            });
        }

        if ($request->filled('id_categoria')) {
            $query->whereHas('medicamento', function ($q) use ($request) {
                $q->where('id_categoria', $request->id_categoria);
            });
        }

        if ($request->filled('id_forma')) {
            $query->where('id_forma_farmaceutica', $request->id_forma);
        }

        if ($request->filled('id_concentracion')) {
            $query->where('id_concentracion', $request->id_concentracion);
        }

        $presentaciones = $query
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json([
            'data' => $presentaciones->map(function ($p) {
                return [
                    'id_presentacion'         => $p->id_presentacion,
                    'id_medicamento'          => $p->id_medicamento,
                    'nombre'                  => $p->medicamento->nombre ?? 'N/A',
                    'concentracion'           => $p->concentracion->concentracion ?? 'N/A',
                    'forma'                   => $p->formaFarmaceutica->forma_farmaceutica ?? 'N/A',
                    'categoria'               => $p->medicamento->categoriaMedicamento->categoria ?? 'N/A',
                    'id_estado'               => $p->medicamento->id_estado ?? null,
                    'estado'                  => $p->medicamento->estado->nombre_estado ?? 'N/A',
                    'descripcion'             => $p->medicamento->descripcion ?? null,
                    'id_categoria'            => $p->medicamento->id_categoria ?? null,
                    'id_concentracion'        => $p->id_concentracion,
                    'id_forma_farmaceutica'   => $p->id_forma_farmaceutica,
                ];
            }),
            'total'        => $presentaciones->total(),
            'per_page'     => $presentaciones->perPage(),
            'current_page' => $presentaciones->currentPage(),
            'last_page'    => $presentaciones->lastPage(),
        ]);
    }

    /**
     * Lista todas las presentaciones (sin paginado) para selects médicos.
     * Incluye el stock disponible en una farmacia específica (para asignar al crear receta).
     */
    public function disponibilidad(Request $request)
    {
        $nitFarmacia = $request->nit_farmacia;

        $presentaciones = Presentacion::with([
            'medicamento',
            'concentracion',
            'formaFarmaceutica',
        ])->whereHas('medicamento', function ($q) {
            $q->where('id_estado', 1);
        })->get();

        return response()->json([
            'data' => $presentaciones->map(function ($p) use ($nitFarmacia) {
                $stock = 0;
                if ($nitFarmacia) {
                    $inv = \App\Models\InventarioFarmacia::where('nit_farmacia', $nitFarmacia)
                        ->where('id_presentacion', $p->id_presentacion)
                        ->first();
                    $stock = $inv ? $inv->stock_actual : 0;
                }
                return [
                    'id_presentacion' => $p->id_presentacion,
                    'label'           => ($p->medicamento->nombre ?? '') . ' ' . ($p->concentracion->concentracion ?? '') . ' (' . ($p->formaFarmaceutica->forma_farmaceutica ?? '') . ')',
                    'nombre'          => $p->medicamento->nombre ?? '',
                    'concentracion'   => $p->concentracion->concentracion ?? '',
                    'forma'           => $p->formaFarmaceutica->forma_farmaceutica ?? '',
                    'stock'           => $stock,
                ];
            }),
        ]);
    }

    /**
     * Crea un medicamento nuevo con su primera presentación.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre'               => 'required|string|max:150',
            'descripcion'          => 'nullable|string',
            'id_categoria'         => 'required|integer|exists:categoria_medicamento,id_categoria',
            'id_concentracion'     => 'required|integer|exists:concentracion,id_concentracion',
            'id_forma_farmaceutica'=> 'required|integer|exists:forma_farmaceutica,id_forma',
        ]);

        $medicamento = Medicamento::create([
            'nombre'       => $request->nombre,
            'descripcion'  => $request->descripcion,
            'id_categoria' => $request->id_categoria,
            'id_estado'    => 1,
        ]);

        $presentacion = Presentacion::create([
            'id_medicamento'        => $medicamento->id_medicamento,
            'id_concentracion'      => $request->id_concentracion,
            'id_forma_farmaceutica' => $request->id_forma_farmaceutica,
        ]);

        return response()->json([
            'message'      => 'Medicamento y presentación creados correctamente',
            'medicamento'  => $medicamento,
            'presentacion' => $presentacion,
        ], 201);
    }

    /**
     * Actualiza un medicamento y su presentación específica.
     */
    public function update(Request $request, $id_presentacion)
    {
        $request->validate([
            'nombre'               => 'required|string|max:150',
            'descripcion'          => 'nullable|string',
            'id_categoria'         => 'required|integer|exists:categoria_medicamento,id_categoria',
            'id_concentracion'     => 'required|integer|exists:concentracion,id_concentracion',
            'id_forma_farmaceutica'=> 'required|integer|exists:forma_farmaceutica,id_forma',
        ]);

        $presentacion = Presentacion::findOrFail($id_presentacion);
        
        $presentacion->update([
            'id_concentracion'      => $request->id_concentracion,
            'id_forma_farmaceutica' => $request->id_forma_farmaceutica,
        ]);

        $medicamento = Medicamento::findOrFail($presentacion->id_medicamento);
        $medicamento->update([
            'nombre'       => $request->nombre,
            'descripcion'  => $request->descripcion,
            'id_categoria' => $request->id_categoria,
        ]);

        return response()->json([
            'message'      => 'Medicamento actualizado correctamente',
            'medicamento'  => $medicamento,
            'presentacion' => $presentacion,
        ]);
    }

    /**
     * Agrega una presentación adicional a un medicamento existente.
     */
    public function storePresentacion(Request $request, $id_medicamento)
    {
        $medicamento = Medicamento::findOrFail($id_medicamento);

        $request->validate([
            'id_concentracion'     => 'required|integer|exists:concentracion,id_concentracion',
            'id_forma_farmaceutica'=> 'required|integer|exists:forma_farmaceutica,id_forma',
        ]);

        $presentacion = Presentacion::create([
            'id_medicamento'        => $medicamento->id_medicamento,
            'id_concentracion'      => $request->id_concentracion,
            'id_forma_farmaceutica' => $request->id_forma_farmaceutica,
        ]);

        return response()->json([
            'message'      => 'Presentación agregada correctamente',
            'presentacion' => $presentacion,
        ], 201);
    }

    /**
     * Cambia el estado activo/inactivo de un medicamento.
     */
    public function toggleEstado($id_medicamento)
    {
        $medicamento = Medicamento::findOrFail($id_medicamento);
        $nuevoEstado = $medicamento->id_estado === 1 ? 2 : 1;
        $medicamento->update(['id_estado' => $nuevoEstado]);

        return response()->json([
            'message'  => 'Estado actualizado correctamente',
            'id_estado'=> $nuevoEstado,
        ]);
    }

    /**
     * Lista categorías para selects.
     */
    public function categorias()
    {
        $categorias = CategoriaMedicamento::where('id_estado', 1)
            ->orderBy('categoria')
            ->get(['id_categoria', 'categoria']);
        return response()->json(['data' => $categorias]);
    }

    /**
     * Lista concentraciones para selects.
     */
    public function concentraciones()
    {
        $concentraciones = Concentracion::orderBy('concentracion')
            ->get(['id_concentracion', 'concentracion']);
        return response()->json(['data' => $concentraciones]);
    }

    /**
     * Lista formas farmacéuticas para selects.
     */
    public function formasFarmaceuticas()
    {
        $formas = FormaFarmaceutica::orderBy('forma_farmaceutica')
            ->get(['id_forma', 'forma_farmaceutica']);
        return response()->json(['data' => $formas]);
    }
}
