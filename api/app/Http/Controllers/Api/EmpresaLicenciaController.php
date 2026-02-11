<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\EmpresaLicencia;
use App\Models\Licencia;
use App\Models\Empresa;

class EmpresaLicenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $historial = EmpresaLicencia::with(['empresa', 'tipoLicencia', 'empresa.adminUser' => function ($query) {
        $query->where('id_rol', 2);
    },])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($historial);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nit' => 'required|exists:empresa,nit',
            'id_tipo_licencia' => 'required|exists:tipo_licencia,id_tipo_licencia',
            'fecha_inicio' => 'required|date',
        ]);

        $tipoLicencia = Licencia::findOrFail($data['id_tipo_licencia']);

        $fechaInicio = Carbon::parse($data['fecha_inicio']);
        $fechaFin = $fechaInicio->copy()->addMonths($tipoLicencia->duracion_meses);

        $numeros = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $letras = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 0, 6));
        $customId = $numeros . $letras;

        $licencia = EmpresaLicencia::create([
            'id_empresa_licencia' => $customId,
            'nit' => $data['nit'],
            'id_tipo_licencia' => $tipoLicencia->id_tipo_licencia,
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
            'id_estado' => 1,
        ]);
        
        $empresa = Empresa::findOrFail($data['nit']);
        $empresa->id_estado = 1;
        $empresa->save();

        return response()->json([
            'data' => $licencia
        ], 201);
    }

    public function activate($nit)
    {
        $licencia = EmpresaLicencia::where('nit', $nit)
            ->where('id_estado', 6)
            ->latest()
            ->first();

        if (!$licencia) {
            return response()->json([
                'message' => 'No se encontró una licencia pendiente para esta empresa.'
            ], 404);
        }

        $licencia->id_estado = 1;
        $licencia->save();

        $empresa = Empresa::findOrFail($nit);
        $empresa->id_estado = 1;
        $empresa->save();

        return response()->json([
            'message' => 'Licencia activada correctamente',
            'data' => $licencia
        ]);
    }
}
