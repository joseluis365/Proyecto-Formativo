<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    $sql = file_get_contents(__DIR__.'/../final.sql');
    DB::unprepared($sql);
    echo "Database restored from final.sql successfully!\n";
} catch (\Exception $e) {
    echo "Error restoring database: " . $e->getMessage() . "\n";
}
