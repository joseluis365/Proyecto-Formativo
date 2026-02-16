<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Http\Requests\StoreEmpresaRequest;
use App\Http\Resources\EmpresaResource;
use App\Events\SystemActivityEvent;
use Barryvdh\DomPDF\Facade\Pdf;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    \Illuminate\Support\Facades\Artisan::call('app:check-licenses');
    $query = Empresa::with(['licenciaActual.tipoLicencia']);

    // Búsqueda
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('nombre', 'like', "%{$search}%")
              ->orWhere('nit', 'like', "%{$search}%");
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
            Empresa::with(['licenciaActual.tipoLicencia', 'adminUser'])->findOrFail($id)
        );
    }

    public function store(StoreEmpresaRequest $request)
    {
        $data = $request->validated();
        
        if (!isset($data['id_estado'])) {
            $data['id_estado'] = 3;
        }

        try {
            return \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
                $empresaData = collect($data)->except(['admin_nombre', 'admin_documento', 'admin_email', 'admin_password'])->toArray();
                $empresa = Empresa::create($empresaData);

                $usuario = \App\Models\Usuario::create([
                    'documento' => $data['admin_documento'],
                    'nombre' => $data['admin_nombre'],
                    'email' => $data['admin_email'],
                    'contrasena' => \Illuminate\Support\Facades\Hash::make($data['admin_password']),
                    'id_rol' => 2,
                    'id_estado' => 1,
                    'nit' => $empresa->nit,
                    'direccion' => $empresa->direccion,
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
            return response()->json([
                'message' => 'Error al crear la empresa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 📌 EXPORTAR PDF (NUEVO MÉTODO)
    public function exportPdf()
    {
        $empresas = Empresa::all();

        $pdf = Pdf::loadView('pdf.empresas', compact('empresas'));

        return $pdf->download('empresas.pdf');
    }

    public function exportCompanyPdf($id)
    {
        $empresa = Empresa::with(['licenciaActual.tipoLicencia', 'adminUser', 'licencias.tipoLicencia' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($id);
        
        $pdf = Pdf::loadView('pdf.empresa_detalle', compact('empresa'));
        return $pdf->download('detalle_empresa_' . $empresa->nit . '.pdf');
    }

    // 📌 ACTUALIZAR
    public function update(Request $request, $id)
    {
        $empresa = Empresa::findOrFail($id);

        $adminIdx = \App\Models\Usuario::where('nit', $empresa->nit)
                        ->where('id_rol', 2)
                        ->first();

        // Prepare validation rules with Rule objects
        // We use the $id (which is the checked NIT) to ignore
        $rules = [
            'nit' => [
                'required', 
                'integer', 
                \Illuminate\Validation\Rule::unique('empresa', 'nit')->ignore($empresa->nit, 'nit')
            ],
            'nombre'   => 'required|string|max:255',
            'email_contacto'  => [
                'required', 
                'email', 
                \Illuminate\Validation\Rule::unique('empresa', 'email_contacto')->ignore($empresa->nit, 'nit')
            ],
            'telefono' => 'required|integer',
            'direccion' => 'required|string',
            'documento_representante' => 'required|integer',
            'nombre_representante' => 'required|string',
            'telefono_representante' => 'required|integer',
            'email_representante' => 'required|email',
            'id_estado' => 'required|integer',
            
            // Optional admin validation
            'admin_nombre' => 'nullable|string|max:255',
            'admin_password' => 'nullable|min:6',
        ];

        // Conditional validation for admin email uniqueness if it changes
        // Use the admin user's document/id to ignore self
        if ($adminIdx) {
            $rules['admin_email'] = [
                'nullable',
                'email',
                // Check uniqueness in 'usuario' table (assuming table name is 'usuario' or 'users' -> model says 'usuario')
                // and ignore the current admin user's document
                \Illuminate\Validation\Rule::unique('usuario', 'email')->ignore($adminIdx->documento, 'documento')
            ];
        } else {
             $rules['admin_email'] = 'nullable|email|unique:usuario,email';
        }

        $data = $request->validate($rules);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($empresa, $adminIdx, $data, $request) {
            
            // 1. Update Company
            // Filter out admin keys from $data before updating company, as $data contains everything from validate
            $empresaData = collect($data)->except(['admin_nombre', 'admin_email', 'admin_password'])->toArray();
            $empresa->update($empresaData);

            // 2. Update Admin User if exists
            if ($adminIdx) {
                // Prepare admin update data
                $adminUpdateCalls = [];
                if ($request->filled('admin_nombre')) $adminUpdateCalls['nombre'] = $request->admin_nombre;
                if ($request->filled('admin_documento')) $adminUpdateCalls['documento'] = $request->admin_documento; // Only if we want to allow updating document? Not in validation above.
                if ($request->filled('admin_email')) $adminUpdateCalls['email'] = $request->admin_email;
                if ($request->filled('admin_password')) {
                    $adminUpdateCalls['contrasena'] = \Illuminate\Support\Facades\Hash::make($request->admin_password);
                }

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