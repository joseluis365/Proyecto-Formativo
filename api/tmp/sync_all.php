<?php

use Illuminate\Support\Facades\DB;

$excludedTables = ['usuario', 'ciudad', 'departamento', 'empresa', 'farmacia'];

$sequences = DB::select("SELECT sequencename, tablename FROM pg_sequences WHERE schemaname = 'public'");

echo "Total sequences found: " . count($sequences) . PHP_EOL;

foreach ($sequences as $seq) {
    $seqName = $seq->sequencename;
    $tableName = $seq->tablename;

    if (in_array($tableName, $excludedTables)) {
        echo "Skipping excluded table sequence: $seqName (Table: $tableName)" . PHP_EOL;
        continue;
    }

    // Try to find the PK column for this table
    $pkResults = DB::select("
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = ?::regclass AND i.indisprimary
    ", [$tableName]);

    if (empty($pkResults)) {
        echo "Could not find PK for $tableName. Skipping sequence $seqName." . PHP_EOL;
        continue;
    }

    $pk = $pkResults[0]->attname;
    $maxId = DB::table($tableName)->max($pk) ?: 0;

    echo "Syncing $tableName ($pk) -> Seq $seqName to $maxId" . PHP_EOL;
    DB::statement("SELECT setval(?, ?, true)", [$seqName, $maxId]);
}

echo "Synchronization complete!" . PHP_EOL;
