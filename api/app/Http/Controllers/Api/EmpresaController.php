<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\EmpresaLicencia;
use App\Http\Requests\StoreEmpresaRequest;
use App\Http\Resources\EmpresaResource;
use App\Events\SystemActivityEvent;
use Barryvdh\DomPDF\Facade\Pdf;

class EmpresaController extends Controller
{
    /**
     * LISTAR EMPRESAS
     */
    public function index(Request $request)
    {
        $query = Empresa::with(['licenciaActual.tipoLicencia']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('nit', 'like', "%{$search}%");
            });
        }

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
     * MOSTRAR EMPRESA
     */
    public function show($id)
    {
        return response()->json(
            Empresa::with([
                'licenciaActual.tipoLicencia',
                'adminUser',
                'ciudad'
            ])->findOrFail($id)
        );
    }

    /**
     * CREAR EMPRESA
     */
    public function store(StoreEmpresaRequest $request)
    {
        $data = $request->validated();

        if (!isset($data['id_estado'])) {
            $data['id_estado'] = 3;
        }

        try {
            return \DB::transaction(function () use ($data) {

                $empresaData = collect($data)
                    ->except([
                        'admin_nombre',
                        'admin_documento',
                        'admin_email',
                        'admin_password'
                    ])->toArray();

                $empresa = Empresa::create($empresaData);

                \App\Models\Usuario::create([
                    'documento' => $data['admin_documento'],
                    'nombre' => $data['admin_nombre'],
                    'apellido' => $data['admin_apellido'],
                    'email' => $data['admin_email'],
                    'telefono' => $data['admin_telefono'],
                    'direccion' => $data['admin_direccion'],
                    'contrasena' => \Hash::make($data['admin_password']),
                    'id_rol' => 2,
                    'id_estado' => 1,
                    'nit' => $empresa->nit,
                    'is_active' => true
                ]);

                event(new SystemActivityEvent(
                    "Nueva empresa registrada: " . $empresa->nombre,
                    'red',
                    'store',
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

    /**
     * EXPORTAR PDF GENERAL
     */
    public function exportPdf()
    {
        $empresas = Empresa::with('ciudad')->get();
        $pdf = Pdf::loadView('pdf.empresas', compact('empresas'));
        return $pdf->download('empresas.pdf');
    }

    /**
     * EXPORTAR PDF DETALLE
     */
    public function exportCompanyPdf($id)
    {
        $empresa = Empresa::with([
            'licenciaActual.tipoLicencia',
            'adminUser',
            'ciudad',
            'licencias.tipoLicencia'
        ])->findOrFail($id);

        $pdf = Pdf::loadView('pdf.empresa_detalle', compact('empresa'));
        return $pdf->download('detalle_empresa_' . $empresa->nit . '.pdf');
    }

    /**
     * ELIMINAR EMPRESA
     */
    public function destroy($id)
    {
        Empresa::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Empresa eliminada'
        ]);
    }

    /**
     * DASHBOARD STATS REALES
     */
    public function getDashboardStats()
    {
        $licenciasActivas = EmpresaLicencia::where('id_estado', 1)->count();
        $licenciasPorVencer = EmpresaLicencia::where('id_estado', 4)->count();
        $licenciasVencidas = EmpresaLicencia::where('id_estado', 5)->count();
        $totalEmpresas = Empresa::count();
        $empresasSinLicencia = Empresa::whereDoesntHave('licencias')->count();

        return response()->json([
            [
                "title" => "Licencias Activas",
                "value" => $licenciasActivas
            ],
            [
                "title" => "Expiran Pronto",
                "value" => $licenciasPorVencer
            ],
            [
                "title" => "Expiradas",
                "value" => $licenciasVencidas
            ],
            [
                "title" => "Total Empresas",
                "value" => $totalEmpresas
            ],
            [
                "title" => "Empresas Sin Licencia",
                "value" => $empresasSinLicencia
            ]
        ]);
    }

    /**
     * LICENCIAS POR MES (Gráfica)
     */
    public function getMonthlyLicenses()
    {
        $data = EmpresaLicencia::selectRaw("
                TO_CHAR(fecha_inicio, 'YYYY-MM') as month,
                COUNT(*) as total
            ")
            ->where('fecha_inicio', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }
}