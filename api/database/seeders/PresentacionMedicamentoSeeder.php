<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PresentacionMedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        $presentaciones = [
            // id_medicamento, id_concentracion, id_forma_farmaceutica, precio_unitario
            ['id_presentacion' => 1, 'id_medicamento' => 1, 'id_concentracion' => 1, 'id_forma_farmaceutica' => 2, 'precio_unitario' => 2500], // Amox 500mg Capsula
            ['id_presentacion' => 2, 'id_medicamento' => 2, 'id_concentracion' => 18, 'id_forma_farmaceutica' => 1, 'precio_unitario' => 1200], // Ibuprofeno 400mg Tableta
            ['id_presentacion' => 3, 'id_medicamento' => 3, 'id_concentracion' => 1, 'id_forma_farmaceutica' => 1, 'precio_unitario' => 800], // Acetaminofen 500mg Tableta
            ['id_presentacion' => 4, 'id_medicamento' => 4, 'id_concentracion' => 5, 'id_forma_farmaceutica' => 1, 'precio_unitario' => 1500], // Loratadina 10mg Tableta
            ['id_presentacion' => 5, 'id_medicamento' => 4, 'id_concentracion' => 6, 'id_forma_farmaceutica' => 3, 'precio_unitario' => 18000], // Loratadina 5mg Jarabe
            ['id_presentacion' => 6, 'id_medicamento' => 5, 'id_concentracion' => 7, 'id_forma_farmaceutica' => 2, 'precio_unitario' => 3500], // Omeprazol 20mg Capsula
            ['id_presentacion' => 7, 'id_medicamento' => 6, 'id_concentracion' => 7, 'id_forma_farmaceutica' => 2, 'precio_unitario' => 4000], // Fluoxetina 20mg Capsula
            ['id_presentacion' => 8, 'id_medicamento' => 7, 'id_concentracion' => 3, 'id_forma_farmaceutica' => 1, 'precio_unitario' => 500], // Vitamina C 1g Tableta
            ['id_presentacion' => 9, 'id_medicamento' => 8, 'id_concentracion' => 1, 'id_forma_farmaceutica' => 1, 'precio_unitario' => 2000], // Naproxeno 500mg Tableta
            ['id_presentacion' => 10, 'id_medicamento' => 9, 'id_concentracion' => 17, 'id_forma_farmaceutica' => 1, 'precio_unitario' => 1300], // Diclofenaco 50mg Tableta
            ['id_presentacion' => 11, 'id_medicamento' => 9, 'id_concentracion' => 23, 'id_forma_farmaceutica' => 6, 'precio_unitario' => 15000], // Diclofenaco 1% Crema
            ['id_presentacion' => 12, 'id_medicamento' => 10, 'id_concentracion' => 1, 'id_forma_farmaceutica' => 1, 'precio_unitario' => 6000], // Azitromicina 500mg Tableta
        ];

        foreach ($presentaciones as $pres) {
            DB::table('presentacion_medicamento')->updateOrInsert(
                ['id_presentacion' => $pres['id_presentacion']],
                [
                    'id_medicamento' => $pres['id_medicamento'],
                    'id_concentracion' => $pres['id_concentracion'],
                    'id_forma_farmaceutica' => $pres['id_forma_farmaceutica'],
                    'precio_unitario' => $pres['precio_unitario'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
