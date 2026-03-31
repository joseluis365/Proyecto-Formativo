<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventarioFarmaciaSeeder extends Seeder
{
    public function run(): void
    {
        // Exact data from final.sql
        $data = [
            ['id_inventario' => 1, 'nit_farmacia' => '298765432-1', 'id_presentacion' => 1, 'stock_actual' => 236,  'created_at' => '2026-03-10 19:41:48', 'updated_at' => '2026-03-19 18:51:45'],
            ['id_inventario' => 2, 'nit_farmacia' => '298765432-1', 'id_presentacion' => 2, 'stock_actual' => 1177, 'created_at' => '2026-03-10 20:11:32', 'updated_at' => '2026-03-27 10:48:24'],
        ];

        foreach ($data as $item) {
            DB::table('inventario_farmacia')->updateOrInsert(['id_inventario' => $item['id_inventario']], $item);
        }
    }
}
