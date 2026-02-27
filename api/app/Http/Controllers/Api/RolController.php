<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rol;
use App\Http\Requests\StoreRolRequest;
use App\Http\Requests\UpdateRolRequest;
use App\Http\Resources\RolResource;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Rol::query();

        if ($request->filled('search')) {
            $query->where('tipo_usu', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->has('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $roles = $query
            ->orderBy('tipo_usu', 'asc')
            ->paginate(10);

        return RolResource::collection($roles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRolRequest $request)
    {
        $rol = Rol::create($request->validated());

        return response()->json([
            'message' => 'Rol creado correctamente',
            'data' => new RolResource($rol)
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRolRequest $request, $id)
    {
        $rol = Rol::findOrFail($id);

        $rol->update($request->validated());

        return response()->json([
            'message' => 'Rol actualizado correctamente',
            'data' => new RolResource($rol)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $rol = Rol::findOrFail($id);

        $rol->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Rol desactivado correctamente'
        ]);
    }
}
