<?php

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Log;

require 'vendor/autoload.php';

// Bootstrap Laravel for a more realistic test
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\ReportService;
use App\Models\Usuario;

echo "Starting Integration PDF test...\n";

try {
    $reportService = app(ReportService::class);
    $entity = 'usuario';
    $params = [];
    
    echo "Getting data for entity: $entity...\n";
    $config = config("reportables.entities.$entity");
    if (!$config) {
        throw new Exception("Entity not configured correctly in reportables.php");
    }
    
    // We'll simulate the export call but manually
    echo "Simulating export call...\n";
    $pdf = $reportService->export($entity, $params, 'pdf');
    
    echo "PDF generated successfully (integration)!\n";
    // We won't stream or download, just getting here is success
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
