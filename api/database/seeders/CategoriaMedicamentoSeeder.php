<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaMedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['id_categoria' => 1, 'categoria' => 'Antibioticos', 'id_estado' => 1],
            ['id_categoria' => 2, 'categoria' => 'Analgésicos', 'id_estado' => 1],
            ['id_categoria' => 3, 'categoria' => 'Antialérgicos', 'id_estado' => 1],
            ['id_categoria' => 4, 'categoria' => 'Antiinflamatorios', 'id_estado' => 1],
            ['id_categoria' => 5, 'categoria' => 'Antipiréticos', 'id_estado' => 1],
            ['id_categoria' => 6, 'categoria' => 'Antidepresivos', 'id_estado' => 1],
            ['id_categoria' => 7, 'categoria' => 'Vacunas', 'id_estado' => 1],
            ['id_categoria' => 8, 'categoria' => 'Suplementos Vitamínicos', 'id_estado' => 1],
            ['id_categoria' => 9, 'categoria' => 'Antiácidos', 'id_estado' => 1],
            ['id_categoria' => 51, 'categoria' => 'Otro', 'id_estado' => 1],
        ];

        foreach ($categorias as $cat) {
            DB::table('categoria_medicamento')->updateOrInsert(
                ['id_categoria' => $cat['id_categoria']],
                [
                    'categoria' => $cat['categoria'],
                    'id_estado' => $cat['id_estado'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
