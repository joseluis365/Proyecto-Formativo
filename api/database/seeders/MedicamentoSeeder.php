<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        $medicamentos = [
            ['id_medicamento' => 1, 'nombre' => 'Amoxicilina', 'descripcion' => 'Antibiótico de amplio espectro para infecciones bacterianas.', 'id_categoria' => 1, 'id_estado' => 1],
            ['id_medicamento' => 2, 'nombre' => 'Ibuprofeno', 'descripcion' => 'Analgésico y antiinflamatorio no esteroideo.', 'id_categoria' => 2, 'id_estado' => 1],
            ['id_medicamento' => 3, 'nombre' => 'Acetaminofén', 'descripcion' => 'Analgésico y antipirético de uso común.', 'id_categoria' => 5, 'id_estado' => 1],
            ['id_medicamento' => 4, 'nombre' => 'Loratadina', 'descripcion' => 'Antihistamínico para tratar alergias.', 'id_categoria' => 3, 'id_estado' => 1],
            ['id_medicamento' => 5, 'nombre' => 'Omeprazol', 'descripcion' => 'Utilizado en el tratamiento de dispepsia, úlcera péptica.', 'id_categoria' => 9, 'id_estado' => 1],
            ['id_medicamento' => 6, 'nombre' => 'Fluoxetina', 'descripcion' => 'Antidepresivo inhibidor de la recaptación de serotonina.', 'id_categoria' => 6, 'id_estado' => 1],
            ['id_medicamento' => 7, 'nombre' => 'Vitamina C', 'descripcion' => 'Suplemento dietético estimulante del sistema inmune.', 'id_categoria' => 8, 'id_estado' => 1],
            ['id_medicamento' => 8, 'nombre' => 'Naproxeno', 'descripcion' => 'Tratamiento del dolor leve a moderado y fiebre.', 'id_categoria' => 4, 'id_estado' => 1],
            ['id_medicamento' => 9, 'nombre' => 'Diclofenaco', 'descripcion' => 'Reduce inflamación y dolor agudo.', 'id_categoria' => 4, 'id_estado' => 1],
            ['id_medicamento' => 10, 'nombre' => 'Azitromicina', 'descripcion' => 'Antibiótico utilizado para tratar diversas infecciones.', 'id_categoria' => 1, 'id_estado' => 1],
        ];

        foreach ($medicamentos as $med) {
            DB::table('medicamento')->updateOrInsert(
                ['id_medicamento' => $med['id_medicamento']],
                [
                    'nombre' => $med['nombre'],
                    'descripcion' => $med['descripcion'],
                    'id_categoria' => $med['id_categoria'],
                    'id_estado' => $med['id_estado'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
