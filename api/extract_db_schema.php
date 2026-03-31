<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
$schema = [];

foreach ($tables as $t) {
    $tableName = $t->table_name;
    $columns = Schema::getColumnListing($tableName);
    $schema[$tableName] = $columns;
}

file_put_contents(__DIR__ . '/../tmp_db_schema.json', json_encode($schema, JSON_PRETTY_PRINT));
echo "Successfully wrote to tmp_db_schema.json\n";
