<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InventarioFarmacia;
use App\Models\MovimientoInventario;
use App\Models\Presentacion;
use App\Models\LoteMedicamento;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class FarmaciaReportesController extends Controller
{
    /**
     * Devuelve la estructura y datos para la tabla en frontend
     */
    public function index(Request $request, $entity)
    {
        $payload = $this->getReportData($request, $entity, false);
        return response()->json($payload);
    }

    /**
     * Genera el PDF con la misma data de la tabla
     */
    public function export(Request $request, $entity)
    {
        $user = $request->user();
        $payload = $this->getReportData($request, $entity, true);

        // Guardar historial
        try {
            if ($user && isset($payload['data'][0])) {
                \App\Models\HistorialReporte::create([
                    'id_usuario' => $user->documento,
                    'tabla_relacion' => $payload['report_title'] ?? "Reporte de Farmacia ({$entity})",
                    'num_registros' => count($payload['data']),
                    'ejemplo_registro' => (array)$payload['data'][0],
                ]);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Error saving report history: " . $e->getMessage());
        }

        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Error encoding logo for PDF: " . $e->getMessage());
        }

        // Render PDF
        $pdf = Pdf::loadView('reports.farmacia', [
            'collection' => $payload['data'], // Collection, not paginator
            'columns'    => $payload['meta']['columns'],
            'title'      => $payload['report_title'],
            'date'       => now()->format('d/m/Y H:i'),
            'total'      => count($payload['data']),
            'generado_por' => $user ? $user->primer_nombre . ' ' . $user->primer_apellido : 'Sistema',
            'doc_generador' => $user ? $user->documento : 'N/A',
            'nombre_farmacia' => $payload['nombre_farmacia'],
            'nit_farmacia' => $payload['nit_farmacia'],
            'logoBase64' => $logoBase64
        ]);

        return $pdf->download("reporte_farmacia_{$entity}_" . now()->format('Ymd_His') . ".pdf");
    }

    private function getReportData(Request $request, $entity, $isExport)
    {
        $user = $request->user();
        $farmacia = \App\Models\Farmacia::where('nit_empresa', $user->nit)
            ->orWhere('nit', $user->nit)
            ->first();

        $nitFarmaciaReal = $farmacia ? $farmacia->nit : $user->nit;
        $nombreFarmacia = $farmacia ? $farmacia->nombre : 'Indefinida';

        $columns = [];
        $title = "Reporte de Farmacia";
        $data = [];

        if ($entity === 'inventario') {
            $title = "Inventario de Medicamentos";
            $columns = [
                'nombre'           => 'Medicamento',
                'forma'            => 'Forma Farmacéutica',
                'concentracion'    => 'Concentración',
                'categoria'        => 'Categoría',
                'stock_actual'     => 'Stock',
                'estado_stock'     => 'Estado',
                'fecha_vencimiento'=> 'Venc. Próximo',
            ];

            $query = InventarioFarmacia::with([
                'presentacion.medicamento.categoriaMedicamento',
                'presentacion.concentracion',
                'presentacion.formaFarmaceutica',
            ])->where('nit_farmacia', $nitFarmaciaReal);

            $inventario = $query->get();
            $hoy = Carbon::today();

            $mapped = $inventario->map(function ($item) use ($hoy, $nitFarmaciaReal) {
                $p = $item->presentacion;
                $loteProximo = LoteMedicamento::where('nit_farmacia', $nitFarmaciaReal)
                    ->where('id_presentacion', $item->id_presentacion)
                    ->where('stock_actual', '>', 0)
                    ->orderBy('fecha_vencimiento', 'asc')
                    ->first();

                $diasVencimiento = null;
                $estadoStock = 'Normal';

                if ($loteProximo) {
                    $diasVencimiento = $hoy->diffInDays(Carbon::parse($loteProximo->fecha_vencimiento), false);
                    if ($diasVencimiento < 0) $estadoStock = 'Vencido';
                    elseif ($diasVencimiento <= 30) $estadoStock = 'Próximo';
                }

                if ($item->stock_actual <= 0) $estadoStock = 'Agotado';
                elseif ($item->stock_actual <= 20 && $estadoStock === 'Normal') $estadoStock = 'Bajo';

                // Usamos objetos para compatibilidad con Pdf::loadView object access, 
                // o si es array data_get() nos salva. Lo hacemos objeto para estandarizar con admin.
                return (object)[
                    'nombre'           => ($p->medicamento->nombre ?? ''),
                    'id_forma'         => $p->id_forma_farmaceutica,
                    'forma'            => $p->formaFarmaceutica->forma_farmaceutica ?? '',
                    'id_concentracion' => $p->id_concentracion,
                    'concentracion'    => $p->concentracion->concentracion ?? '',
                    'categoria'        => $p->medicamento->categoriaMedicamento->categoria ?? '',
                    'stock_actual'     => $item->stock_actual,
                    'estado_stock'     => $estadoStock,
                    'fecha_vencimiento'=> $loteProximo ? Carbon::parse($loteProximo->fecha_vencimiento)->format('d/m/Y') : 'N/A',
                    'dias_vencimiento' => $diasVencimiento,
                ];
            });

            if ($request->filled('search')) {
                $search = strtolower($request->search);
                $mapped = $mapped->filter(function ($item) use ($search) {
                    return str_contains(strtolower($item->nombre), $search) || str_contains(strtolower($item->concentracion), $search);
                });
            }
            if ($request->filled('id_forma')) {
                $mapped = $mapped->where('id_forma', $request->id_forma);
            }
            if ($request->filled('id_concentracion')) {
                $mapped = $mapped->where('id_concentracion', $request->id_concentracion);
            }
            if ($request->filled('estado')) {
                $mapped = $mapped->where('estado_stock', $request->estado);
            }

            $mapped = $mapped->sort(function ($a, $b) {
                $da = $a->dias_vencimiento;
                $db = $b->dias_vencimiento;
                if ($da === null && $db === null) return 0;
                if ($da === null) return 1;
                if ($db === null) return -1;
                return $da <=> $db;
            })->values();

            $data = $mapped;
            
        } elseif ($entity === 'medicamentos') {
            $title = "Catálogo de Medicamentos";
            $columns = [
                'nombre'        => 'Nombre y Categoría',
                'concentracion' => 'Concentración',
                'forma'         => 'Forma Farmacéutica',
                'estado'        => 'Estado',
            ];

            $query = Presentacion::with([
                'medicamento.categoriaMedicamento',
                'medicamento.estado',
                'concentracion',
                'formaFarmaceutica',
            ]);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->whereHas('medicamento', function ($q) use ($search) {
                    $q->where('nombre', 'ILIKE', '%' . $search . '%');
                })->orWhereHas('concentracion', function ($q) use ($search) {
                    $q->where('concentracion', 'ILIKE', '%' . $search . '%');
                });
            }
            if ($request->filled('id_forma')) {
                $query->where('id_forma_farmaceutica', $request->id_forma);
            }
            if ($request->filled('id_concentracion')) {
                $query->where('id_concentracion', $request->id_concentracion);
            }

            $presentaciones = $query->orderByDesc('created_at')->get();

            $data = $presentaciones->map(function ($p) {
                $medNombre = $p->medicamento->nombre ?? 'N/A';
                $cat = $p->medicamento->categoriaMedicamento->categoria ?? 'N/A';
                return (object)[
                    'nombre'        => $medNombre . ' (' . $cat . ')',
                    'concentracion' => $p->concentracion->concentracion ?? 'N/A',
                    'forma'         => $p->formaFarmaceutica->forma_farmaceutica ?? 'N/A',
                    'estado'        => $p->medicamento->estado->nombre_estado ?? 'N/A',
                    'id_estado'     => $p->medicamento->id_estado ?? null,
                ];
            });

        } elseif ($entity === 'movimientos') {
            $title = "Historial de Movimientos";
            $columns = [
                'tipo_movimiento' => 'Tipo',
                'medicamento'     => 'Medicamento',
                'cantidad'        => 'Cant.',
                'fecha'           => 'Fecha',
                'motivo'          => 'Motivo/Orden',
                'responsable'     => 'Responsable',
                'paciente'        => 'Paciente',
            ];

            $query = MovimientoInventario::with([
                'loteMedicamento.presentacion.medicamento',
                'loteMedicamento.presentacion.concentracion',
                'loteMedicamento.presentacion.formaFarmaceutica',
                'usuarioDocumento',
                'dispensacion.detalleReceta.receta.paciente',
            ])->whereHas('loteMedicamento', function ($q) use ($nitFarmaciaReal) {
                $q->where('nit_farmacia', $nitFarmaciaReal);
            });

            if ($request->filled('search')) {
                $search = $request->search;
                $query->whereHas('loteMedicamento.presentacion.medicamento', function ($q) use ($search) {
                    $q->where('nombre', 'ILIKE', '%' . $search . '%');
                });
            }

            if ($request->filled('tipo')) {
                $tipo = $request->tipo;
                if ($tipo === 'ingresos') {
                    $query->where('tipo_movimiento', 'Ingreso');
                } elseif ($tipo === 'salidas_manuales') {
                    $query->where('tipo_movimiento', 'Salida')->whereNull('id_dispensacion');
                } elseif ($tipo === 'ordenes_medicas') {
                    $query->where('tipo_movimiento', 'Salida')->whereNotNull('id_dispensacion');
                }
            }

            if ($request->filled('paciente')) {
                $pacienteSearch = strtolower($request->paciente);
                $query->whereHas('dispensacion.detalleReceta.receta.paciente', function ($q) use ($pacienteSearch) {
                    $q->whereRaw("LOWER(CONCAT(primer_nombre, ' ', primer_apellido)) LIKE ?", ["%{$pacienteSearch}%"])
                      ->orWhere('documento', 'LIKE', "%{$pacienteSearch}%");
                });
            }

            $movimientos = $query->orderByDesc('fecha')->get();

            $data = $movimientos->map(function ($m) {
                $lote = $m->loteMedicamento;
                $p    = $lote?->presentacion;
                $med  = $p?->medicamento;
                $resp = $m->usuarioDocumento;
                $pacienteModel = $m->dispensacion?->detalleReceta?->receta?->paciente;
                
                $tipoLabel = $m->tipo_movimiento;
                if ($tipoLabel === 'Salida') {
                    $tipoLabel = $m->id_dispensacion ? 'Orden Médica' : 'Salida Manual';
                }

                return (object)[
                    'tipo_movimiento' => $tipoLabel,
                    'medicamento'     => ($med->nombre ?? '') . ' ' . ($p?->concentracion->concentracion ?? '') . ' (' . ($p?->formaFarmaceutica->forma_farmaceutica ?? '') . ')',
                    'cantidad'        => $m->cantidad,
                    'fecha'           => Carbon::parse($m->fecha)->format('d/m/Y'),
                    'motivo'          => $m->motivo ?? ($m->id_dispensacion ? 'Receta #'.$m->dispensacion->detalleReceta->id_receta : 'N/A'),
                    'responsable'     => $resp ? ($resp->primer_nombre . ' ' . $resp->primer_apellido) : 'N/A',
                    'paciente'        => $pacienteModel ? ($pacienteModel->primer_nombre . ' ' . $pacienteModel->primer_apellido) : 'N/A',
                ];
            });
        }

        // Apply Export Limit or Manual Pagination
        if ($isExport) {
            $data = collect($data)->take(2000); // hard limit for PDFs
        } else {
            $perPage = 15;
            $page = $request->input('page', 1);
            $total = count($data);
            $paginated = collect($data)->slice(($page - 1) * $perPage, $perPage)->values();
        }

        return [
            'entity'       => $entity,
            'report_title' => $title,
            'nit_farmacia' => $nitFarmaciaReal,
            'nombre_farmacia' => $nombreFarmacia,
            'meta'         => [
                'columns'    => $columns,
                'exportable' => ['pdf'],
                'has_dates'  => false // simplificando sin fechas por ahora
            ],
            'data'         => $isExport ? $data : collect($paginated),
            'total'        => $isExport ? count($data) : $total,
            'per_page'     => $isExport ? count($data) : $perPage,
            'last_page'    => $isExport ? 1 : ceil($total / $perPage),
            'current_page' => $isExport ? 1 : (int)$page
        ];
    }
}
