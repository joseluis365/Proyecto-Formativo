<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Estado;
use App\Http\Requests\StoreEstadoRequest;
use App\Http\Requests\UpdateEstadoRequest;
use App\Http\Resources\EstadoResource;

class EstadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Estado::query();

        if ($request->filled('search')) {
            $query->where('nombre_estado', 'ILIKE', '%' . $request->search . '%');
        }

        $estados = $query
            ->orderBy('id_estado', 'asc')
            ->paginate(10);

        return EstadoResource::collection($estados);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEstadoRequest $request)
    {
        $estado = Estado::create($request->validated());

        return response()->json([
            'message' => 'Estado creado correctamente',
            'data' => new EstadoResource($estado)
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEstadoRequest $request, $id)
    {
        $estado = Estado::findOrFail($id);

        $estado->update($request->validated());

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'data' => new EstadoResource($estado)
        ]);
    }
}
