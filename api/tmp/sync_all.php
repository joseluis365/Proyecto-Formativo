<?php

use Illuminate\Support\Facades\DB;

$excludedTables = ['usuario', 'ciudad', 'departamento', 'empresa', 'farmacia'];

$sequences = DB::select("
    SELECT c.relname AS sequencename, t.relname AS tablename
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_depend d ON d.objid = c.oid
    JOIN pg_class t ON d.refobjid = t.oid
    WHERE c.relkind = 'S' AND n.nspname = 'public'
");

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
    $maxId = DB::table($tableName)->max($pk);

    if ($maxId !== null && !is_numeric($maxId)) {
        echo "Skipping non-numeric PK '$maxId' for table $tableName" . PHP_EOL;
        continue;
    }

    $maxId = (int) $maxId;

    if ($maxId > 0) {
        echo "Syncing $tableName ($pk) -> Seq $seqName to $maxId" . PHP_EOL;
        DB::statement("SELECT setval(?, ?, true)", [$seqName, $maxId]);
    } else {
        echo "Syncing empty table $tableName ($pk) -> Seq $seqName to 1 (false)" . PHP_EOL;
        DB::statement("SELECT setval(?, 1, false)", [$seqName]);
    }
}

echo "Synchronization complete!" . PHP_EOL;
