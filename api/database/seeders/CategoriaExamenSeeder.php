<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaExamenSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_categoria_examen' => 2, 'categoria' => 'Orina',   'id_estado' => 1, 'created_at' => '2026-03-06 16:51:39', 'updated_at' => '2026-03-06 16:51:39', 'requiere_ayuno' => false],
            ['id_categoria_examen' => 3, 'categoria' => 'Fisicos', 'id_estado' => 1, 'created_at' => '2026-03-06 16:51:59', 'updated_at' => '2026-03-06 16:51:59', 'requiere_ayuno' => false],
            ['id_categoria_examen' => 1, 'categoria' => 'Sangre',  'id_estado' => 1, 'created_at' => '2026-03-01 20:01:15', 'updated_at' => '2026-03-01 20:01:15', 'requiere_ayuno' => true],
        ];

        foreach ($data as $item) {
            DB::table('categoria_examen')->updateOrInsert(['id_categoria_examen' => $item['id_categoria_examen']], $item);
        }
    }
}
