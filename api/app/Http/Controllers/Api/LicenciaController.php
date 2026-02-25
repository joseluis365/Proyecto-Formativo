<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Licencia;
use App\Http\Requests\StoreLicenciaRequest;
use App\Http\Requests\UpdateLicenciaRequest;
use App\Http\Resources\LicenciaResource;
use Illuminate\Support\Facades\DB;
use App\Models\EmpresaLicencia;
use App\Models\Empresa;
use App\Events\SystemActivityEvent;

class LicenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    $query = Licencia::withCount('empresaLicencias');

    if ($request->has('id_estado')) {
        $estado = $request->id_estado;
        
        if (is_array($estado)) {
            $query->whereIn('id_estado', $estado);
        } elseif (str_contains($estado, ',')) {
            $query->whereIn('id_estado', explode(',', $estado));
        } else {
            $query->where('id_estado', $estado);
        }
    }

    $licencias = $query->get();

    $maxCount = $licencias->max('empresa_licencias_count');
    $licencias->each(function ($licencia) use ($maxCount) {
        $licencia->is_popular = ($maxCount > 0 && $licencia->empresa_licencias_count === $maxCount);
    });

    return response()->json([
        'total' => $licencias->count(),
        'data' => LicenciaResource::collection($licencias)
    ]);
    }

    public function show($id)
    {
        return response()->json(
            Licencia::findOrFail($id)
        );
    }

    public function store(StoreLicenciaRequest $request)
    {
    $licencia = Licencia::create($request->validated());

    event(new SystemActivityEvent(
                "Licencia creada: " . $licencia->tipo, 
                'teal',                                   
                'add',                                       
                'superadmin-feed'
            ));

    return response()->json([
        'message' => 'Licencia creado correctamente',
        'data' => $licencia
    ], 201);
    }

    public function pendientes()
    {
    $pendientes = EmpresaLicencia::where('id_estado', 6)
        ->with('empresa') 
        ->get();

    return response()->json($pendientes);
    }

    public function activar($id)
    {
        return DB::transaction(function () use ($id) {
        $licencia = EmpresaLicencia::findOrFail($id);

        $licencia->update(['id_estado' => 1]);

        $empresa = Empresa::where('nit', $licencia->nit)->first();
        if ($empresa) {
            $empresa->update(['id_estado' => 1]);

            event(new SystemActivityEvent(
                        "Licencia activada: " . $licencia->id_empresa_licencia, 
                        'blue',                                   
                        'store',                                       
                        'superadmin-feed'
                    ));
        }

        return response()->json(['message' => 'Licencia y empresa activadas con éxito.']);
        });
    }

    public function update(UpdateLicenciaRequest $request, $id)
    {
        $licencia = Licencia::findOrFail($id);

        $data = $request->validated();

        $licencia->update($data);

        event(new SystemActivityEvent(
                    "Licencia actualizada: " . $licencia->tipo,
                    'blue',                                 
                    'store',                                      
                    'superadmin-feed'
                ));

        return response()->json([
            'message' => 'Licencia actualizada correctamente',
            'licencia' => $licencia
        ]);
    }

    public function destroy($id)
    {
        $licencia = Licencia::findOrFail($id);
        $licencia->delete();

        event(new SystemActivityEvent(
                    "Licencia eliminada: " . $licencia->tipo, 
                    'red',                                   
                    'delete',                                 
                    'superadmin-feed'
                ));

        return response()->json([
            'message' => 'Licencia eliminada'
        ]);
    }
}