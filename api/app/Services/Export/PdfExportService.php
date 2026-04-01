<?php

namespace App\Services\Export;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;

/**
 * Servicio de exportacion PDF.
 * Encapsula construccion y salida de documentos en formato PDF.
 */
class PdfExportService
{
    /**
     * Genera un PDF dinámico basado en la configuración del reporte y los datos.
     */
    public function generate(string $entityKey, array $config, Collection $collection)
    {
        $landscape = in_array($entityKey, config('reportables.settings.pdf_landscape', []));
        $columns = $config['columns'];
        $title = $config['label'] ?? 'Reporte de Sistema';
        $date = now()->format('d/m/Y H:i');
        $total = $collection->count();

        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Error encoding logo for PDF: " . $e->getMessage());
        }

        $pdf = Pdf::loadView('reports.dynamic', compact('collection', 'columns', 'title', 'date', 'total', 'logoBase64'));

        if ($landscape) {
            $pdf->setPaper('a4', 'landscape');
        }

        return $pdf;
    }
}
