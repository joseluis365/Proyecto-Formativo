<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicamento;

class AdminMedicamentoController extends Controller
{
    public function index(Request $request)
    {
        $query = Medicamento::with(['categoriaMedicamento', 'estado']);

        if ($request->filled('search')) {
            $query->where('nombre', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        }

        if ($request->has('nopaginate')) {
            return response()->json(['data' => $query->orderBy('nombre', 'asc')->get()]);
        }

        $items = $query->orderBy('id_medicamento', 'desc')->paginate(15);
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'id_categoria' => 'required|integer|exists:categoria_medicamento,id_categoria',
            'id_estado' => 'nullable|integer|exists:estado,id_estado'
        ]);

        $data = $request->all();
        if(!isset($data['id_estado'])) $data['id_estado'] = 1;

        $item = Medicamento::create($data);
        return response()->json(['message' => 'Creado correctamente', 'data' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $item = Medicamento::findOrFail($id);
        $request->validate([
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'id_categoria' => 'required|integer|exists:categoria_medicamento,id_categoria'
        ]);

        $item->update($request->all());
        return response()->json(['message' => 'Actualizado correctamente', 'data' => $item]);
    }

    public function destroy($id)
    {
        $item = Medicamento::findOrFail($id);
        $item->update(['id_estado' => 2]);
        return response()->json(['message' => 'Mecidamento inactivado correctamente']);
    }
}
