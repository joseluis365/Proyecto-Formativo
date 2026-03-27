<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\MotivoConsulta;

class MotivoConsultaController extends Controller
{
    public function index(Request $request)
    {
        if ($request->boolean('paginate')) {
            $query = MotivoConsulta::query();

            if ($request->filled('search')) {
                $query->where('motivo', 'ILIKE', '%' . $request->search . '%');
            }

            if ($request->filled('id_estado')) {
                $query->where('id_estado', $request->id_estado);
            }

            $motivos = $query->orderBy('id_motivo', 'asc')->paginate(10);

            return \App\Http\Resources\MotivoConsultaResource::collection($motivos);
        }

        // Retorno original para selectores del sistema
        $motivos = MotivoConsulta::whereHas('estado', function ($q) {
            $q->where('nombre_estado', 'Activo');
        })->get(['id_motivo as value', 'motivo as label']);

        return response()->json($motivos);
    }

    public function store(\App\Http\Requests\StoreMotivoConsultaRequest $request)
    {
        $motivo = MotivoConsulta::create($request->validated());

        return response()->json([
            'message' => 'Motivo de consulta creado correctamente',
            'data' => new \App\Http\Resources\MotivoConsultaResource($motivo)
        ], 201);
    }

    public function update(\App\Http\Requests\UpdateMotivoConsultaRequest $request, $id)
    {
        $motivo = MotivoConsulta::findOrFail($id);
        $motivo->update($request->validated());

        return response()->json([
            'message' => 'Motivo de consulta actualizado correctamente',
            'data' => new \App\Http\Resources\MotivoConsultaResource($motivo)
        ]);
    }

    public function destroy($id)
    {
        $motivo = MotivoConsulta::findOrFail($id);
        
        // Soft delete conceptual pasando a estado inactivo (2)
        $motivo->update(['id_estado' => 2]);

        return response()->json([
            'message' => 'Motivo de consulta desactivado correctamente'
        ]);
    }
}
