<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FormaFarmaceutica;

/**
 * Controlador de formas farmaceuticas.
 * Mantiene el catalogo de presentaciones farmaceuticas.
 */
class FormaFarmaceuticaController extends Controller
{
    public function index(Request $request)
    {
        $query = FormaFarmaceutica::query();

        if ($request->filled('search')) {
            $query->where('forma_farmaceutica', 'ILIKE', '%' . $request->search . '%');
        }

        $items = $query->orderBy('id_forma', 'desc')->paginate(15);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate(['forma_farmaceutica' => 'required|string|max:100|unique:forma_farmaceutica,forma_farmaceutica']);
        $item = FormaFarmaceutica::create(['forma_farmaceutica' => $request->forma_farmaceutica]);
        return response()->json(['message' => 'Creado correctamente', 'data' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $item = FormaFarmaceutica::findOrFail($id);
        $request->validate(['forma_farmaceutica' => 'required|string|max:100|unique:forma_farmaceutica,forma_farmaceutica,'.$id.',id_forma']);
        $item->update(['forma_farmaceutica' => $request->forma_farmaceutica]);
        return response()->json(['message' => 'Actualizado correctamente', 'data' => $item]);
    }

    public function destroy($id)
    {
        $item = FormaFarmaceutica::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
