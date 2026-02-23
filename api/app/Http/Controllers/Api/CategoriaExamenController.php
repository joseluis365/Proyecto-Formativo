<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CategoriaExamen;
use App\Http\Requests\StoreCategoriaExamenRequest;
use App\Http\Requests\UpdateCategoriaExamenRequest;
use App\Http\Resources\CategoriaExamenResource;

class CategoriaExamenController extends Controller
{
    public function index(Request $request)
    {
        $query = CategoriaExamen::with('estado');

        if ($request->filled('search')) {
            $query->where('categoria', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        }

        $categorias = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return CategoriaExamenResource::collection($categorias);
    }

    public function store(StoreCategoriaExamenRequest $request)
    {
        $categoria = CategoriaExamen::create([
            'categoria' => $request->categoria,
            'id_estado' => 1
        ]);

        return response()->json([
            'message' => 'Categoría de examen creada correctamente',
            'data' => new CategoriaExamenResource($categoria)
        ], 201);
    }

    public function update(UpdateCategoriaExamenRequest $request, $id)
    {
        $categoria = CategoriaExamen::findOrFail($id);

        $categoria->update([
            'categoria' => $request->categoria
        ]);

        return response()->json([
            'message' => 'Categoría de examen actualizada correctamente',
            'data' => new CategoriaExamenResource($categoria)
        ]);
    }

    public function destroy($id)
    {
        $categoria = CategoriaExamen::findOrFail($id);

        $categoria->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Categoría de examen desactivada correctamente'
        ]);
    }
}
