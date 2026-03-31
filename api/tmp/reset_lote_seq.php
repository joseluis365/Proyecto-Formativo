<?php
use Illuminate\Support\Facades\DB;
$maxId = DB::table('lote_medicamento')->max('id_lote') ?: 0;
DB::statement("SELECT setval('lote_medicamento_id_lote_seq', $maxId, true)");
echo "Reset lote_medicamento sequence to $maxId";
