<?php

namespace App\Services\Export;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;

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

        $pdf = Pdf::loadView('reports.dynamic', compact('collection', 'columns', 'title', 'date', 'total'));

        if ($landscape) {
            $pdf->setPaper('a4', 'landscape');
        }

        return $pdf;
    }
}
