<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Remision;
use App\Models\Receta;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

/**
 * Controlador de PDFs medicos.
 * Gestiona la exportacion de documentos clinicos en formato PDF.
 */
class PdfMedicoController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────
    // PDF: Detalle de una Cita Médica
    // ─────────────────────────────────────────────────────────────────────
    public function citaPdf($id)
    {
        $cita = Cita::with([
            'paciente',
            'medico',
            'especialidad',
            'estado',
            'historialDetalle.enfermedades',
            'historialDetalle.remisiones.especialidad',
            'historialDetalle.remisiones.categoriaExamen',
            'historialDetalle.remisiones.cita.medico',
            'historialDetalle.remisiones.examen',
            'historialDetalle.remisiones.prioridad',
            'historialDetalle.remisiones.estado',
            'historialDetalle.receta.recetaDetalles.presentacion.medicamento',
            'historialDetalle.receta.recetaDetalles.presentacion.concentracion',
            'historialDetalle.receta.recetaDetalles.presentacion.formaFarmaceutica',
            'historialDetalle.receta.recetaDetalles.farmacia',
            'historialDetalle.receta.estado',
        ])->findOrFail($id);

        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Error encoding logo for PDF: " . $e->getMessage());
        }

        $pdf = Pdf::loadView('pdfs.cita', compact('cita', 'logoBase64'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("consulta_{$cita->id_cita}.pdf");
    }

    // ─────────────────────────────────────────────────────────────────────
    // PDF: Detalle de una Remisión
    // ─────────────────────────────────────────────────────────────────────
    public function remisionPdf($id)
    {
        $remision = Remision::with([
            'especialidad',
            'categoriaExamen',
            'examen',
            'prioridad',
            'estado',
            'cita.medico',
            'historialDetalle.cita.paciente',
            'historialDetalle.cita.medico',
            'historialDetalle.cita.especialidad',
        ])->findOrFail($id);

        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Error encoding logo for PDF: " . $e->getMessage());
        }

        $pdf = Pdf::loadView('pdfs.remision', compact('remision', 'logoBase64'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("remision_{$remision->id_remision}.pdf");
    }

    // ─────────────────────────────────────────────────────────────────────
    // PDF: Detalle de una Receta Médica
    // ─────────────────────────────────────────────────────────────────────
    public function recetaPdf($id)
    {
        $receta = Receta::with([
            'estado',
            'historialDetalle.cita.paciente',
            'historialDetalle.cita.medico',
            'historialDetalle.cita.especialidad',
            'recetaDetalles.presentacion.medicamento',
            'recetaDetalles.presentacion.concentracion',
            'recetaDetalles.presentacion.formaFarmaceutica',
            'recetaDetalles.farmacia',
        ])->findOrFail($id);

        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Error encoding logo for PDF: " . $e->getMessage());
        }

        $pdf = Pdf::loadView('pdfs.receta', compact('receta', 'logoBase64'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("receta_{$receta->id_receta}.pdf");
    }
}
