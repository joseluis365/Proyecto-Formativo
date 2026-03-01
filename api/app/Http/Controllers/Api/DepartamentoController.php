<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Departamento;
use App\Http\Requests\StoreDepartamentoRequest;
use App\Http\Requests\UpdateDepartamentoRequest;
use App\Http\Resources\DepartamentoResource;

class DepartamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Departamento::query();

        if ($request->filled('search')) {
            $query->where('nombre', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->has('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $departamentos = $query
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return DepartamentoResource::collection($departamentos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepartamentoRequest $request)
    {
        $departamento = Departamento::create($request->validated());

        return response()->json([
            'message' => 'Departamento creado correctamente',
            'data' => new DepartamentoResource($departamento)
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartamentoRequest $request, $codigo_DANE)
    {
        $departamento = Departamento::findOrFail($codigo_DANE);

        $departamento->update($request->validated());

        return response()->json([
            'message' => 'Departamento actualizado correctamente',
            'data' => new DepartamentoResource($departamento)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codigo_DANE)
    {
        $departamento = Departamento::findOrFail($codigo_DANE);

        $departamento->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Departamento desactivado correctamente'
        ]);
    }
}
