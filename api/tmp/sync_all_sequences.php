<?php

use Illuminate\Support\Facades\DB;

try {
    $excludedTables = ['usuario', 'ciudad', 'departamento', 'empresa', 'farmacia', 'migrations', 'personal_access_tokens', 'failed_jobs', 'jobs', 'sessions'];

    // Get all tables in the public schema
    $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");

    echo "Found " . count($tables) . " tables." . PHP_EOL;

    foreach ($tables as $tableInfo) {
        $table = $tableInfo->table_name;
        
        if (in_array($table, $excludedTables)) {
            echo "Skipping excluded table: $table" . PHP_EOL;
            continue;
        }

        // Attempt to find the primary key column(s)
        $pkResults = DB::select("
            SELECT a.attname
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = ?::regclass AND i.indisprimary
        ", [$table]);

        if (empty($pkResults)) {
            echo "No primary key found for table: $table. Skipping." . PHP_EOL;
            continue;
        }

        $pk = $pkResults[0]->attname;

        // Get sequence name for this column
        $seqResult = DB::select("SELECT pg_get_serial_sequence(?, ?)", [$table, $pk]);
        $seqName = $seqResult[0]->pg_get_serial_sequence ?? null;

        if ($seqName) {
            $maxId = DB::table($table)->max($pk) ?: 0;
            echo "Syncing $table ($pk): Seq $seqName to $maxId" . PHP_EOL;
            
            DB::statement("SELECT setval(?, ?, true)", [$seqName, $maxId]);
        } else {
            echo "No sequence for $table.$pk" . PHP_EOL;
        }
    }

    echo "DONE!" . PHP_EOL;
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
}
