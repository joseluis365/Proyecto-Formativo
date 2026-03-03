<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmpresaLicenciaRequest;
use Carbon\Carbon;
use App\Models\EmpresaLicencia;
use App\Models\Licencia;
use App\Models\Empresa;
use App\Events\SystemActivityEvent;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use App\Mail\LicenciaActivadaEmpresa;
use App\Mail\LicenciaActivadaAdmin;

class EmpresaLicenciaController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = EmpresaLicencia::with(['empresa', 'tipoLicencia', 'empresa.adminUser' => function ($q) {
            $q->where('id_rol', 2);
        }]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id_empresa_licencia', 'ilike', "%{$search}%")
                  ->orWhereHas('empresa', function($qEmp) use ($search) {
                      $qEmp->where('nombre', 'ilike', "%{$search}%")
                           ->orWhere('nit', 'ilike', "%{$search}%");
                  });
            });
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        }

        $historial = $query->orderBy('created_at', 'desc')->get();

        return response()->json($historial);
    }

    public function getTipos() {
    return response()->json(Licencia::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmpresaLicenciaRequest $request)
    {
        $data = $request->validated();

        $tipoLicencia = Licencia::findOrFail($data['id_tipo_licencia']);

        $numeros = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $letras = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 0, 6));
        $customId = $numeros . $letras;

        $licencia = EmpresaLicencia::create([
            'id_empresa_licencia' => $customId,
            'nit' => $data['nit'],
            'id_tipo_licencia' => $tipoLicencia->id_tipo_licencia,
            'fecha_inicio' => null,
            'fecha_fin' => null,
            'id_estado' => 6,
        ]);
        
        $empresa = Empresa::findOrFail($data['nit']);
        $empresa->id_estado = 1;
        $empresa->save();

        event(new SystemActivityEvent(
            "Nueva licencia registrada: " . $customId, // Título
            'blue',                                   // Tipo (Color rojo)
            'store',                                       // Icono
            'superadmin-feed'
        ));

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

        // Cargar el tipo de licencia para obtener la duración
        $licencia->load('tipoLicencia');
        
        $fechaInicio = Carbon::now()->timezone('America/Bogota');
        // Asumiendo que tipoLicencia siempre existe si la llave foránea está bien
        $duracion = $licencia->tipoLicencia ? $licencia->tipoLicencia->duracion_meses : 0; 
        $fechaFin = $fechaInicio->copy()->addMonths($duracion);

        $licencia->fecha_inicio = $fechaInicio;
        $licencia->fecha_fin = $fechaFin;

        $licencia->id_estado = 1;
        $licencia->save();

        $empresa = Empresa::findOrFail($nit);
        $empresa->id_estado = 1;
        $empresa->save();
        
        // Cargar el administrador para el correo
        $empresa->load('adminUser');

        // Enviar correos de activación en segundo plano
        // 1. Al contacto de la empresa
        Mail::to($empresa->email_contacto)->queue(new LicenciaActivadaEmpresa($empresa, $licencia));

        // 2. Al administrador
        if ($empresa->adminUser) {
            Mail::to($empresa->adminUser->email)->queue(new LicenciaActivadaAdmin($empresa, $empresa->adminUser));
        }

        event(new SystemActivityEvent(
            "Licencia activada: " . $licencia->id_empresa_licencia, // Título
            'blue',                                   // Tipo (Color rojo)
            'store',                                       // Icono
            'superadmin-feed'
        ));

        return response()->json([
            'message' => 'Licencia activada correctamente',
            'data' => $licencia
        ]);
    }

    public function exportHistoryPdf(\Illuminate\Http\Request $request)
    {
        $query = EmpresaLicencia::with(['empresa', 'tipoLicencia', 'empresa.adminUser' => function ($q) {
            $q->where('id_rol', 2);
        }]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id_empresa_licencia', 'ilike', "%{$search}%")
                  ->orWhereHas('empresa', function($qEmp) use ($search) {
                      $qEmp->where('nombre', 'ilike', "%{$search}%")
                           ->orWhere('nit', 'ilike', "%{$search}%");
                  });
            });
        }

        if ($request->filled('id_estado')) {
            $query->where('id_estado', $request->id_estado);
        }

        $historial = $query->orderBy('created_at', 'desc')->get();

        $pdf = Pdf::loadView('pdf.historial_licencias', compact('historial'));
        return $pdf->download('historial_licencias.pdf');
    }
}
