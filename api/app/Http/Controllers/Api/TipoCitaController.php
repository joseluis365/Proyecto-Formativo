<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TipoCita;
use App\Http\Requests\StoreTipoCitaRequest;
use App\Http\Requests\UpdateTipoCitaRequest;
use App\Http\Resources\TipoCitaResource;

class TipoCitaController extends Controller
{
    public function index(Request $request)
    {
        $query = TipoCita::with('estado');

        if ($request->filled('search')) {
            $query->where('tipo', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        } elseif (!$request->boolean('all')) {
            $query->where('id_estado', 1);
        }

        $tipos = $query
            ->orderBy('tipo', 'asc')
            ->paginate(10);

        return TipoCitaResource::collection($tipos);
    }

    public function store(StoreTipoCitaRequest $request)
    {
        $tipo = TipoCita::create([
            'tipo' => $request->tipo,
            'id_estado' => 1
        ]);

        return response()->json([
            'message' => 'Tipo de cita creado correctamente',
            'data' => new TipoCitaResource($tipo)
        ], 201);
    }

    public function update(UpdateTipoCitaRequest $request, $id)
    {
        $tipo = TipoCita::findOrFail($id);

        $tipo->update([
            'tipo' => $request->tipo
        ]);

        return response()->json([
            'message' => 'Tipo de cita actualizado correctamente',
            'data' => new TipoCitaResource($tipo)
        ]);
    }

    public function destroy($id)
    {
        $tipo = TipoCita::findOrFail($id);

        $tipo->update([
            'id_estado' => 2
        ]);

        return response()->json([
            'message' => 'Tipo de cita desactivado correctamente'
        ]);
    }
}
