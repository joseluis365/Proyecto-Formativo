<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoteMedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        // Exact data from final.sql
        $data = [
            ['id_lote' => 1, 'id_presentacion' => 1, 'nit_farmacia' => '298765432-1', 'fecha_vencimiento' => '2026-03-26', 'stock_actual' => 270,  'created_at' => '2026-03-10 19:41:48', 'updated_at' => '2026-03-19 18:51:45'],
            ['id_lote' => 2, 'id_presentacion' => 2, 'nit_farmacia' => '298765432-1', 'fecha_vencimiento' => '2026-03-20', 'stock_actual' => 1000, 'created_at' => '2026-03-10 20:11:32', 'updated_at' => '2026-03-10 20:11:51'],
            ['id_lote' => 3, 'id_presentacion' => 2, 'nit_farmacia' => '298765432-1', 'fecha_vencimiento' => '2026-03-31', 'stock_actual' => 170,  'created_at' => '2026-03-27 10:26:50', 'updated_at' => '2026-03-27 10:48:24'],
            ['id_lote' => 4, 'id_presentacion' => 2, 'nit_farmacia' => '298765432-1', 'fecha_vencimiento' => '2026-08-27', 'stock_actual' => 7,    'created_at' => '2026-03-27 10:28:02', 'updated_at' => '2026-03-27 10:28:02'],
        ];

        foreach ($data as $item) {
            DB::table('lote_medicamento')->updateOrInsert(['id_lote' => $item['id_lote']], $item);
        }
    }
}
