<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Http\Requests\StoreEmpresaRequest;
use App\Http\Requests\UpdateEmpresaRequest;
use App\Http\Resources\EmpresaResource;
use App\Events\SystemActivityEvent;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Artisan;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    Artisan::call('app:check-licenses');
    $query = Empresa::with(['licenciaActual.tipoLicencia']);

    // Búsqueda
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('nombre', 'ilike', "%{$search}%")
              ->orWhere('nit', 'ilike', "%{$search}%");
        });
    }

    // Filtro por estado
    if ($request->filled('id_estado')) {
        $estado = $request->id_estado;
        if ($estado == 3) {
            $query->whereDoesntHave('licencias');
        } else {
            $query->whereHas('licenciaActual', function ($q) use ($estado) {
                $q->where('id_estado', $estado);
            });
        }
    }

    $empresas = $query->get();

    return response()->json([
        'data' => EmpresaResource::collection($empresas)
    ]);
}


    /**
     * Store a newly created resource in storage.
     */
    public function show($id)
    {
        return response()->json(
            Empresa::with(['licenciaActual.tipoLicencia', 'adminUser', 'ciudad'])->findOrFail($id)
        );
    }

    public function store(StoreEmpresaRequest $request)
    {
        $data = $request->validated();

        $data['nombre'] = strip_tags($data['nombre']);
        $data['email_contacto'] = strip_tags($data['email_contacto']);
        $data['direccion'] = strip_tags($data['direccion']);
        $data['nombre_representante'] = strip_tags($data['nombre_representante']);
        $data['admin_primer_nombre'] = strip_tags($data['admin_primer_nombre']);
        $data['admin_segundo_nombre'] = isset($data['admin_segundo_nombre']) ? strip_tags($data['admin_segundo_nombre']) : null;
        $data['admin_primer_apellido'] = strip_tags($data['admin_primer_apellido']);
        $data['admin_segundo_apellido'] = isset($data['admin_segundo_apellido']) ? strip_tags($data['admin_segundo_apellido']) : null;
        $data['admin_email'] = strip_tags($data['admin_email']);
        $data['admin_direccion'] = strip_tags($data['admin_direccion']);
        
        if (!isset($data['id_estado'])) {
            $data['id_estado'] = 3;
        }

        try {
            return DB::transaction(function () use ($data) {
                $empresaData = collect($data)->except(['admin_primer_nombre', 'admin_segundo_nombre', 'admin_primer_apellido', 'admin_segundo_apellido', 'admin_documento', 'admin_email', 'admin_password'])->toArray();
                $empresa = Empresa::create($empresaData);

                $usuario = \App\Models\Usuario::create([
                    'documento' => $data['admin_documento'], // No strip_tags for numbers
                    'primer_nombre' => $data['admin_primer_nombre'],
                    'segundo_nombre' => $data['admin_segundo_nombre'],
                    'primer_apellido' => $data['admin_primer_apellido'],
                    'segundo_apellido' => $data['admin_segundo_apellido'],
                    'email' => strip_tags($data['admin_email']),
                    'telefono' => $data['admin_telefono'], // No strip_tags for numbers
                    'direccion' => strip_tags($data['admin_direccion']),
                    'contrasena' => Hash::make($data['admin_password']),
                    
                    'id_rol' => 2,
                    'id_estado' => 1,
                    'nit' => $empresa->nit,
                    'is_active' => true 
                ]);

                event(new SystemActivityEvent(
                    "Nueva empresa registrada: " . $empresa->nombre, // Título
                    'red',                                   // Tipo (Color rojo)
                    'store',                                       // Icono
                    'superadmin-feed'
                ));

                return response()->json([
                    'message' => 'Empresa y administrador creados correctamente',
                    'data' => $empresa
                ], 201);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error registrando empresa: ' . $e->getMessage() . ' en ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'message' => 'Error al crear la empresa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 📌 EXPORTAR PDF (NUEVO MÉTODO)

    public function exportPdf()
    {
        $empresas = Empresa::with('ciudad')->get();

        $pdf = Pdf::loadView('pdf.empresas', compact('empresas'));

        return $pdf->download('empresas.pdf');
    }

    public function exportCompanyPdf($id)
    {
        $empresa = Empresa::with(['licenciaActual.tipoLicencia', 'adminUser', 'ciudad', 'licencias.tipoLicencia' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);
        
        $pdf = Pdf::loadView('pdf.empresa_detalle', compact('empresa'));
        return $pdf->download('detalle_empresa_' . $empresa->nit . '.pdf');
    }

    // 📌 ACTUALIZAR

public function update(UpdateEmpresaRequest $request, $id)
{
    $empresa = Empresa::findOrFail($id);

    $adminIdx = \App\Models\Usuario::where('nit', $empresa->nit)
                    ->where('id_rol', 2)
                    ->first();

    $data = $request->validated();

    // Sanitizar entradas contra XSS (usar strip_tags en vez de Purifier)
    $data['nombre'] = strip_tags($data['nombre']);
    $data['email_contacto'] = strip_tags($data['email_contacto']);
    $data['telefono'] = strip_tags($data['telefono']);
    $data['direccion'] = strip_tags($data['direccion']);
    $data['nombre_representante'] = strip_tags($data['nombre_representante']);
    $data['email_representante'] = strip_tags($data['email_representante']);
    $data['admin_primer_nombre'] = strip_tags($data['admin_primer_nombre']);
    if (isset($data['admin_segundo_nombre'])) $data['admin_segundo_nombre'] = strip_tags($data['admin_segundo_nombre']);
    $data['admin_primer_apellido'] = strip_tags($data['admin_primer_apellido']);
    if (isset($data['admin_segundo_apellido'])) $data['admin_segundo_apellido'] = strip_tags($data['admin_segundo_apellido']);
    if (isset($data['admin_email'])) $data['admin_email'] = strip_tags($data['admin_email']);
    if (isset($data['admin_telefono'])) $data['admin_telefono'] = strip_tags($data['admin_telefono']);
    if (isset($data['admin_direccion'])) $data['admin_direccion'] = strip_tags($data['admin_direccion']);

    return DB::transaction(function () use ($empresa, $adminIdx, $data, $request) {
        
        // Actualizar empresa
        $empresaData = collect($data)->except(['admin_primer_nombre', 'admin_segundo_nombre', 'admin_primer_apellido', 'admin_segundo_apellido', 'admin_email', 'admin_documento', 'admin_telefono', 'admin_direccion'])->toArray();
        $empresa->update($empresaData);

        // Actualizar usuario administrador
        if ($adminIdx) {
            $adminUpdateCalls = [];
            if ($request->filled('admin_primer_nombre')) $adminUpdateCalls['primer_nombre'] = strip_tags($request->admin_primer_nombre);
            if ($request->filled('admin_segundo_nombre')) $adminUpdateCalls['segundo_nombre'] = strip_tags($request->admin_segundo_nombre);
            if ($request->filled('admin_primer_apellido')) $adminUpdateCalls['primer_apellido'] = strip_tags($request->admin_primer_apellido);
            if ($request->filled('admin_segundo_apellido')) $adminUpdateCalls['segundo_apellido'] = strip_tags($request->admin_segundo_apellido);
            if ($request->filled('admin_email')) $adminUpdateCalls['email'] = strip_tags($request->admin_email);
            if ($request->filled('admin_telefono')) $adminUpdateCalls['telefono'] = strip_tags($request->admin_telefono);
            if ($request->filled('admin_direccion')) $adminUpdateCalls['direccion'] = strip_tags($request->admin_direccion);

            if (!empty($adminUpdateCalls)) {
                $adminIdx->update($adminUpdateCalls);
            }
        }

        $empresa->refresh();

        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'data' => $empresa->load('adminUser')
        ]);
    });
}

    // 📌 ELIMINAR
    public function destroy($id)
    {
        Empresa::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Empresa eliminada'
        ]);
    }
    // 📌 DASHBOARD STATS
    public function getDashboardStats()
    {
        // 1. Licencias Activas (id_estado = 1)
        $activeNow = \App\Models\EmpresaLicencia::where('id_estado', 1)->count();
        $activeLastMonth = \App\Models\EmpresaLicencia::where('id_estado', 1)
            ->whereDate('fecha_inicio', '<', \Carbon\Carbon::now()->subMonth())
            ->count();
        
        $activeChange = $this->calculatePercentageChange($activeNow, $activeLastMonth);

        // 2. Expiran Pronto (id_estado = 4)
        $expiringNow = \App\Models\EmpresaLicencia::where('id_estado', 4)->count();
        $expiringLastMonth = \App\Models\EmpresaLicencia::where('id_estado', 4)
            ->whereDate('created_at', '<', \Carbon\Carbon::now()->subMonth()) // Aproximación
            ->count();
        
        $expiringChange = $this->calculatePercentageChange($expiringNow, $expiringLastMonth);

        // 3. Expiradas (id_estado = 5)
        $expiredNow = \App\Models\EmpresaLicencia::where('id_estado', 5)->count();
        $expiredLastMonth = \App\Models\EmpresaLicencia::where('id_estado', 5)
            ->whereDate('fecha_fin', '<', \Carbon\Carbon::now()->subMonth())
            ->count();

        $expiredChange = $this->calculatePercentageChange($expiredNow, $expiredLastMonth);

        // 4. Total Empresas
        $totalNow = Empresa::count();
        $totalLastMonth = Empresa::whereDate('created_at', '<', \Carbon\Carbon::now()->subMonth())->count();

        $totalChange = $this->calculatePercentageChange($totalNow, $totalLastMonth);

        return response()->json([
            [
                "title" => "Licencias Activas",
                "value" => (string)$activeNow,
                "change" => $activeChange,
                "type" => $this->getChangeType($activeChange)
            ],
            [
                "title" => "Expiran pronto",
                "value" => (string)$expiringNow,
                "change" => $expiringChange,
                "type" => "warning" 
            ],
            [
                "title" => "Expiradas",
                "value" => (string)$expiredNow,
                "change" => $expiredChange,
                "type" => "negative"
            ],
            [
                "title" => "Total Empresas",
                "value" => (string)$totalNow,
                "change" => $totalChange,
                "type" => "warning"
            ]
        ]);
    }

    private function calculatePercentageChange($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? "+100%" : "0%";
        }
        $diff = $current - $previous;
        $percentage = ($diff / $previous) * 100;
        return ($percentage > 0 ? "+" : "") . round($percentage, 1) . "% vs mes anterior";
    }

    private function getChangeType($changeString)
    {
        if (str_contains($changeString, '+')) return 'positive';
        if (str_contains($changeString, '-')) return 'negative';
        return 'warning';
    }
}