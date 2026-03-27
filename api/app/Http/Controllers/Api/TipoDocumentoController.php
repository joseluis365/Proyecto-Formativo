<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TipoDocumentoController extends Controller
{
    /**
     * Display a listing of active document types.
     */
    public function index(Request $request)
    {
        if ($request->boolean('paginate')) {
            $query = TipoDocumento::query();

            if ($request->filled('search')) {
                $query->where('tipo_documento', 'ILIKE', '%' . $request->search . '%');
            }

            if ($request->filled('id_estado')) {
                $query->where('id_estado', $request->id_estado);
            }

            $tiposDocumento = $query->orderBy('id_tipo_documento', 'asc')->paginate(10);

            return \App\Http\Resources\TipoDocumentoResource::collection($tiposDocumento);
        }

        // 1 refers to "Activo" state
        $tiposDocumento = Cache::remember('tipos_documento_activos', 86400, function () {
            return TipoDocumento::where('id_estado', 1)->get();
        });
        return response()->json($tiposDocumento);
    }

    public function store(\App\Http\Requests\StoreTipoDocumentoRequest $request)
    {
        $tipoDocumento = TipoDocumento::create($request->validated());
        Cache::forget('tipos_documento_activos');

        return response()->json([
            'message' => 'Tipo de documento creado correctamente',
            'data' => new \App\Http\Resources\TipoDocumentoResource($tipoDocumento)
        ], 201);
    }

    public function update(\App\Http\Requests\UpdateTipoDocumentoRequest $request, $id)
    {
        $tipoDocumento = TipoDocumento::findOrFail($id);
        $tipoDocumento->update($request->validated());
        Cache::forget('tipos_documento_activos');

        return response()->json([
            'message' => 'Tipo de documento actualizado correctamente',
            'data' => new \App\Http\Resources\TipoDocumentoResource($tipoDocumento)
        ]);
    }

    public function destroy($id)
    {
        $tipoDocumento = TipoDocumento::findOrFail($id);
        
        $tipoDocumento->update(['id_estado' => 2]);
        Cache::forget('tipos_documento_activos');

        return response()->json([
            'message' => 'Tipo de documento desactivado correctamente'
        ]);
    }
}
