<?php
use Illuminate\Support\Facades\DB;
$maxId = DB::table('inventario_farmacia')->max('id_inventario') ?: 0;
DB::statement("SELECT setval('inventario_farmacia_id_inventario_seq', $maxId, true)");
echo "Reset inventario_farmacia sequence to $maxId";
