<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Licencia;
use App\Http\Requests\StoreLicenciaRequest;
use App\Http\Resources\LicenciaResource;
use Illuminate\Support\Facades\DB;
use App\Models\EmpresaLicencia;
use App\Models\Empresa;

class LicenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    // 1. Obtenemos las licencias con su conteo
    $licencias = Licencia::withCount('empresaLicencias')->get();

    // 2. Encontramos el conteo máximo
    $maxCount = $licencias->max('empresa_licencias_count');

    // 3. Marcamos manualmente cuál es popular en la colección
    $licencias->each(function ($licencia) use ($maxCount) {
        // Creamos una propiedad dinámica en el modelo
        $licencia->is_popular = ($maxCount > 0 && $licencia->empresa_licencias_count === $maxCount);
    });

    return response()->json([
        'total' => $licencias->count(),
        'data' => LicenciaResource::collection($licencias)
    ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function show($id)
    {
        return response()->json(
            Licencia::findOrFail($id)
        );
    }

    // 📌 CREAR
    public function store(StoreLicenciaRequest $request)
    {
    $licencia = Licencia::create($request->validated());

    return response()->json([
        'message' => 'Licencia creado correctamente',
        'data' => $licencia
    ], 201);
    }

    public function pendientes()
    {
    // Obtenemos las licencias en estado 6 (Pendiente) con los datos de la empresa
    $pendientes = EmpresaLicencia::where('id_estado', 6)
        ->with('empresa') 
        ->get();

    return response()->json($pendientes);
    }

    public function activar($id)
    {
        return DB::transaction(function () use ($id) {
        $licencia = EmpresaLicencia::findOrFail($id);

        // 1. Activar la licencia
        $licencia->update(['id_estado' => 1]);

        // 2. Activar la empresa vinculada
        $empresa = Empresa::where('nit', $licencia->nit)->first();
        if ($empresa) {
            $empresa->update(['id_estado' => 1]);
        }

        return response()->json(['message' => 'Licencia y empresa activadas con éxito.']);
        });
    }

    // 📌 ACTUALIZAR
    public function update(Request $request, $id)
    {
        $licencia = Licencia::findOrFail($id);

        $data = $request->validate([
            'tipo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'precio' => 'sometimes|numeric',
            'duracion_meses' => 'sometimes|integer',
            'id_estado' => 'sometimes|integer',
        ]);

        $licencia->update($data);

        return response()->json([
            'message' => 'Licencia actualizada correctamente',
            'licencia' => $licencia
        ]);
    }

    // 📌 ELIMINAR
    public function destroy($id)
    {
        Licencia::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Licencia eliminada'
        ]);
    }
}