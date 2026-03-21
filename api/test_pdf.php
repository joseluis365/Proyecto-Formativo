<?php
require 'vendor/autoload.php';

// Mocking Laravel environment for dompdf facade if possible, 
// or just using the class directly.
use Barryvdh\DomPDF\PDF;
use Dompdf\Dompdf;
use Dompdf\Options;

echo "Starting PDF test...\n";

try {
    $options = new Options();
    $options->set('isHtml5ParserEnabled', true);
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml('<h1>Test PDF</h1><p>If you see this, basic Dompdf works.</p>');
    $dompdf->render();
    echo "PDF rendered successfully!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
