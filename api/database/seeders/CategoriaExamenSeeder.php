<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaExamenSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['id_categoria_examen' => 1, 'categoria' => 'Sangre', 'requiere_ayuno' => true, 'id_estado' => 1],
            ['id_categoria_examen' => 2, 'categoria' => 'Orina', 'requiere_ayuno' => false, 'id_estado' => 1],
            ['id_categoria_examen' => 3, 'categoria' => 'Fisicos', 'requiere_ayuno' => false, 'id_estado' => 1],
            ['id_categoria_examen' => 4, 'categoria' => 'Imagenología', 'requiere_ayuno' => false, 'id_estado' => 1],
            ['id_categoria_examen' => 5, 'categoria' => 'Cardiología', 'requiere_ayuno' => false, 'id_estado' => 1],
            ['id_categoria_examen' => 6, 'categoria' => 'Endoscopia', 'requiere_ayuno' => true, 'id_estado' => 1],
            ['id_categoria_examen' => 7, 'categoria' => 'Neurología', 'requiere_ayuno' => false, 'id_estado' => 1],
            ['id_categoria_examen' => 8, 'categoria' => 'Heces', 'requiere_ayuno' => false, 'id_estado' => 1],
        ];

        foreach ($categorias as $cat) {
            DB::table('categoria_examen')->updateOrInsert(
                ['id_categoria_examen' => $cat['id_categoria_examen']],
                [
                    'categoria' => $cat['categoria'],
                    'requiere_ayuno' => $cat['requiere_ayuno'],
                    'id_estado' => $cat['id_estado'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
