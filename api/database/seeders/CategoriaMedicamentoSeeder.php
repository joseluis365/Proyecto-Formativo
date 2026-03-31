<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaMedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_categoria' => 1, 'categoria' => 'Antibioticos',   'id_estado' => 1, 'created_at' => '2026-03-01 20:02:31', 'updated_at' => '2026-03-06 16:53:14'],
            ['id_categoria' => 2, 'categoria' => 'Analgésicos',    'id_estado' => 1, 'created_at' => '2026-03-06 16:53:26', 'updated_at' => '2026-03-06 16:53:26'],
            ['id_categoria' => 3, 'categoria' => 'Antialérgicos',  'id_estado' => 1, 'created_at' => '2026-03-06 16:53:51', 'updated_at' => '2026-03-06 16:53:51'],
        ];

        foreach ($data as $item) {
            DB::table('categoria_medicamento')->updateOrInsert(['id_categoria' => $item['id_categoria']], $item);
        }
    }
}
