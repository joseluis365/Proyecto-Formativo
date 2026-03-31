<?php

use Illuminate\Support\Facades\DB;

try {
    $table = 'medicamento';
    $primaryKey = 'id_medicamento';
    
    // Get max ID
    $maxId = DB::table($table)->max($primaryKey) ?: 0;
    
    // Get sequence name
    $seqResult = DB::select("SELECT pg_get_serial_sequence(?, ?)", [$table, $primaryKey]);
    $seqName = $seqResult[0]->pg_get_serial_sequence ?? null;
    
    if ($seqName) {
        $currVal = DB::selectOne("SELECT last_value FROM $seqName")->last_value;
        echo "Table: $table, PK: $primaryKey, MaxID: $maxId, Seq: $seqName, CurrVal: $currVal" . PHP_EOL;
        
        if ($maxId >= $currVal) {
            echo "Resetting sequence..." . PHP_EOL;
            DB::statement("SELECT setval(?, ?, true)", [$seqName, $maxId]);
            echo "Sequence reset to $maxId" . PHP_EOL;
        } else {
            echo "Sequence is correct." . PHP_EOL;
        }
    } else {
        echo "No sequence found for $table.$primaryKey. Table might not be SERIAL." . PHP_EOL;
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . PHP_EOL;
}
