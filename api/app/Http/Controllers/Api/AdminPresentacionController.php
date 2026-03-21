<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Presentacion;
use Illuminate\Validation\Rule;

class AdminPresentacionController extends Controller
{
    public function index(Request $request)
    {
        $query = Presentacion::with(['medicamento.estado', 'medicamento.categoriaMedicamento', 'concentracion', 'formaFarmaceutica']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('medicamento', function ($q) use ($search) {
                $q->where('nombre', 'ILIKE', '%' . $search . '%');
            });
        }

        $items = $query->orderBy('id_presentacion', 'desc')->paginate(15);
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_medicamento' => [
                'required',
                'integer',
                'exists:medicamento,id_medicamento',
                Rule::unique('presentacion_medicamento')
                    ->where('id_medicamento', $request->id_medicamento)
                    ->where('id_concentracion', $request->id_concentracion)
                    ->where('id_forma_farmaceutica', $request->id_forma_farmaceutica)
            ],
            'id_concentracion' => 'required|integer|exists:concentracion,id_concentracion',
            'id_forma_farmaceutica' => 'required|integer|exists:forma_farmaceutica,id_forma'
        ], [
            'id_medicamento.unique' => 'La combinación de este medicamento con la concentración y forma seleccionadas ya existe.'
        ]);

        $item = Presentacion::create($request->all());
        return response()->json(['message' => 'Creado correctamente', 'data' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $item = Presentacion::findOrFail($id);
        $request->validate([
            'id_medicamento' => [
                'required',
                'integer',
                'exists:medicamento,id_medicamento',
                Rule::unique('presentacion_medicamento')
                    ->where('id_medicamento', $request->id_medicamento)
                    ->where('id_concentracion', $request->id_concentracion)
                    ->where('id_forma_farmaceutica', $request->id_forma_farmaceutica)
                    ->ignore($id, 'id_presentacion')
            ],
            'id_concentracion' => 'required|integer|exists:concentracion,id_concentracion',
            'id_forma_farmaceutica' => 'required|integer|exists:forma_farmaceutica,id_forma'
        ], [
            'id_medicamento.unique' => 'La combinación de este medicamento con la concentración y forma seleccionadas ya existe.'
        ]);

        $item->update($request->all());
        return response()->json(['message' => 'Actualizado correctamente', 'data' => $item]);
    }

    public function destroy($id)
    {
        $item = Presentacion::findOrFail($id);
        // Las presentaciones no tienen estado, se hace delete físico o si el usuario quiere inactivación lógica requerirá agregar el campo en la BD. Como no está pediremos borrar.
        $item->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
