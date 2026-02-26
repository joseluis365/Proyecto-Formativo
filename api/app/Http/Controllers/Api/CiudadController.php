<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ciudad;
use App\Http\Requests\StoreCiudadRequest;
use App\Http\Requests\UpdateCiudadRequest;
use App\Http\Resources\CiudadResource;

class CiudadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Ciudad::with(['departamento']);

        if ($request->filled('search')) {
            $query->where('nombre', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->has('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $ciudades = $query
            ->orderBy('nombre', 'asc')
            ->paginate(10);

        return CiudadResource::collection($ciudades);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCiudadRequest $request)
    {
        $ciudad = Ciudad::create($request->validated());

        return response()->json([
            'message' => 'Ciudad creada correctamente',
            'data' => new CiudadResource($ciudad)
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCiudadRequest $request, $codigo_postal)
    {
        $ciudad = Ciudad::findOrFail($codigo_postal);

        $ciudad->update($request->validated());

        return response()->json([
            'message' => 'Ciudad actualizada correctamente',
            'data' => new CiudadResource($ciudad)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codigo_postal)
    {
        $ciudad = Ciudad::findOrFail($codigo_postal);

        $ciudad->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Ciudad desactivada correctamente'
        ]);
    }
}
