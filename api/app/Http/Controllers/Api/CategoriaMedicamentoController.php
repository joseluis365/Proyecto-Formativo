<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CategoriaMedicamento;
use App\Http\Requests\StoreCategoriaMedicamentoRequest;
use App\Http\Requests\UpdateCategoriaMedicamentoRequest;
use App\Http\Resources\CategoriaMedicamentoResource;

class CategoriaMedicamentoController extends Controller
{
    public function index(Request $request)
    {
        $query = CategoriaMedicamento::with('estado');

        if ($request->filled('search')) {
            $query->where('categoria', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $categorias = $query
            ->orderBy('categoria', 'asc')
            ->paginate(10);

        return CategoriaMedicamentoResource::collection($categorias);
    }

    public function store(StoreCategoriaMedicamentoRequest $request)
    {
        $categoria = CategoriaMedicamento::create([
            'categoria' => $request->categoria,
            'id_estado' => 1
        ]);

        return response()->json([
            'message' => 'Categoría de medicamento creada correctamente',
            'data' => new CategoriaMedicamentoResource($categoria)
        ], 201);
    }

    public function update(UpdateCategoriaMedicamentoRequest $request, $id)
    {
        $categoria = CategoriaMedicamento::findOrFail($id);

        $categoria->update([
            'categoria' => $request->categoria
        ]);

        return response()->json([
            'message' => 'Categoría de medicamento actualizada correctamente',
            'data' => new CategoriaMedicamentoResource($categoria)
        ]);
    }

    public function destroy($id)
    {
        $categoria = CategoriaMedicamento::findOrFail($id);

        $categoria->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Categoría de medicamento desactivada correctamente'
        ]);
    }
}
