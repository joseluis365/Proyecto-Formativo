<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prioridad;
use App\Http\Requests\StorePrioridadRequest;
use App\Http\Requests\UpdatePrioridadRequest;
use App\Http\Resources\PrioridadResource;

class PrioridadController extends Controller
{
    public function index(Request $request)
    {
        $query = Prioridad::with('estado');

        if ($request->filled('search')) {
            $query->where('prioridad', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $prioridades = $query
            ->orderBy('prioridad', 'asc')
            ->paginate(10);

        return PrioridadResource::collection($prioridades);
    }

    public function store(StorePrioridadRequest $request)
    {
        $prioridad = Prioridad::create([
            'prioridad' => $request->prioridad,
            'id_estado' => 1
        ]);

        return response()->json([
            'message' => 'Prioridad creada correctamente',
            'data' => new PrioridadResource($prioridad)
        ], 201);
    }

    public function update(UpdatePrioridadRequest $request, $id)
    {
        $prioridad = Prioridad::findOrFail($id);

        $prioridad->update([
            'prioridad' => $request->prioridad
        ]);

        return response()->json([
            'message' => 'Prioridad actualizada correctamente',
            'data' => new PrioridadResource($prioridad)
        ]);
    }

    public function destroy($id)
    {
        $prioridad = Prioridad::findOrFail($id);

        $prioridad->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Prioridad desactivada correctamente'
        ]);
    }
}