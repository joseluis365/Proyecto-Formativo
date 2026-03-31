<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_medicamento' => 1, 'nombre' => 'Acetaminofen', 'descripcion' => 'Pastillas de Acetaminofen',      'id_categoria' => 2, 'id_estado' => 1, 'created_at' => '2026-03-10 19:09:58', 'updated_at' => '2026-03-10 19:09:58'],
            ['id_medicamento' => 2, 'nombre' => 'Paracetamol',  'descripcion' => 'Paracetamol en pastas',          'id_categoria' => 2, 'id_estado' => 1, 'created_at' => '2026-03-10 19:37:57', 'updated_at' => '2026-03-19 03:57:54'],
            ['id_medicamento' => 3, 'nombre' => 'Ibuprofeno',   'descripcion' => 'xxxxx',                          'id_categoria' => 1, 'id_estado' => 2, 'created_at' => '2026-03-10 20:10:30', 'updated_at' => '2026-03-19 03:31:33'],
            ['id_medicamento' => 4, 'nombre' => 'Amoxicilina',  'descripcion' => 'medicamento muy efectivo',       'id_categoria' => 3, 'id_estado' => 1, 'created_at' => '2026-03-19 03:54:17', 'updated_at' => '2026-03-19 03:54:17'],
        ];

        foreach ($data as $item) {
            DB::table('medicamento')->updateOrInsert(['id_medicamento' => $item['id_medicamento']], $item);
        }
    }
}
