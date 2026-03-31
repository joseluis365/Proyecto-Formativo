<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PresentacionMedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_presentacion' => 1, 'id_medicamento' => 2, 'id_concentracion' => 1, 'id_forma_farmaceutica' => 1, 'created_at' => '2026-03-10 19:37:57', 'updated_at' => '2026-03-10 19:37:57', 'precio_unitario' => 2000],
            ['id_presentacion' => 2, 'id_medicamento' => 3, 'id_concentracion' => 1, 'id_forma_farmaceutica' => 1, 'created_at' => '2026-03-10 20:10:30', 'updated_at' => '2026-03-10 20:10:30', 'precio_unitario' => 3000],
        ];

        foreach ($data as $item) {
            DB::table('presentacion_medicamento')->updateOrInsert(['id_presentacion' => $item['id_presentacion']], $item);
        }
    }
}
