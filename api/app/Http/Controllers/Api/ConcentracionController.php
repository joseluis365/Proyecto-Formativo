<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Concentracion;

/**
 * Controlador de concentraciones.
 * Gestiona concentraciones de medicamentos para formulacion y despacho.
 */
class ConcentracionController extends Controller
{
    public function index(Request $request)
    {
        $query = Concentracion::query();

        if ($request->filled('search')) {
            $query->where('concentracion', 'ILIKE', '%' . $request->search . '%');
        }

        $items = $query->orderBy('id_concentracion', 'desc')->paginate(15);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate(['concentracion' => 'required|string|max:100|unique:concentracion,concentracion']);
        $item = Concentracion::create(['concentracion' => $request->concentracion]);
        return response()->json(['message' => 'Creado correctamente', 'data' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $item = Concentracion::findOrFail($id);
        $request->validate(['concentracion' => 'required|string|max:100|unique:concentracion,concentracion,'.$id.',id_concentracion']);
        $item->update(['concentracion' => $request->concentracion]);
        return response()->json(['message' => 'Actualizado correctamente', 'data' => $item]);
    }

    public function destroy($id)
    {
        $item = Concentracion::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
