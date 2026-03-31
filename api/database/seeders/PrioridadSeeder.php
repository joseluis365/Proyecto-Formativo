<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrioridadSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_prioridad' => 1, 'prioridad' => 'Normal', 'id_estado' => 1, 'created_at' => '2026-03-01 19:57:14', 'updated_at' => '2026-03-06 16:48:56'],
            ['id_prioridad' => 2, 'prioridad' => 'Baja',   'id_estado' => 1, 'created_at' => '2026-03-06 16:49:15', 'updated_at' => '2026-03-06 16:50:22'],
            ['id_prioridad' => 3, 'prioridad' => 'Alta',   'id_estado' => 1, 'created_at' => '2026-03-06 16:50:31', 'updated_at' => '2026-03-06 16:50:31'],
        ];

        foreach ($data as $item) {
            DB::table('prioridad')->updateOrInsert(['id_prioridad' => $item['id_prioridad']], $item);
        }
    }
}
