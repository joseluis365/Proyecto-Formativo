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
        $historial = EmpresaLicencia::with(['empresa', 'tipoLicencia'])
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
            'nit' => 'required|exists:empresa,nit', // Note: Table is 'empresa' not 'empresas' based on Model
            'id_tipo_licencia' => 'required|exists:tipo_licencia,id_tipo_licencia', // Note: Model says table 'tipo_licencia', PK 'id_tipo_licencia'
            'fecha_inicio' => 'required|date',
        ]);

        $tipoLicencia = Licencia::findOrFail($data['id_tipo_licencia']);

        $fechaInicio = Carbon::parse($data['fecha_inicio']);
        $fechaFin = $fechaInicio->copy()->addMonths($tipoLicencia->duracion_meses);

        // Generar ID personalizado: 6 números + 6 letras
        // Ejemplo: 123456ABCDEF
        $numeros = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $letras = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 0, 6));
        $customId = $numeros . $letras;

        // Crear la licencia
        $licencia = EmpresaLicencia::create([
            'id_empresa_licencia' => $customId,
            'nit' => $data['nit'],
            'id_tipo_licencia' => $tipoLicencia->id_tipo_licencia, // Use correct Column
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
            'id_estado' => 1, // Licencia Activa
        ]);
        
        // Actualizar estado de la empresa
        $empresa = Empresa::findOrFail($data['nit']);
        $empresa->id_estado = 1; // 1 = Con Licencia Activa (asumido)
        $empresa->save();

        return response()->json([
            'data' => $licencia
        ], 201);
    }

    public function activate($nit)
    {
        // Buscar la licencia pendiente (6) más reciente o cualquiera que necesite activación
        $licencia = EmpresaLicencia::where('nit', $nit)
            ->where('id_estado', 6) // Pendiente
            ->latest()
            ->first();

        if (!$licencia) {
            return response()->json([
                'message' => 'No se encontró una licencia pendiente para esta empresa.'
            ], 404);
        }

        // Actualizar estado licencia
        $licencia->id_estado = 1; // Activa
        $licencia->save();

        // Actualizar estado empresa (opcional, pero consistente con la lógica previa)
        $empresa = Empresa::findOrFail($nit);
        $empresa->id_estado = 1;
        $empresa->save();

        return response()->json([
            'message' => 'Licencia activada correctamente',
            'data' => $licencia
        ]);
    }
}
