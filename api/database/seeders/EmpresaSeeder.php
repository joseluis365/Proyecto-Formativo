<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nit' => '900123456-5',
                'nombre' => 'Saluvanta EPS',
                'email_contacto' => 'contacto@saluvanta.com',
                'telefono' => '3001234567',
                'direccion' => 'Calle 100 # 45-67',
                'documento_representante' => 1001234567,
                'nombre_representante' => 'Juan Guillermo Perez',
                'telefono_representante' => '3109876543',
                'email_representante' => 'gerencia@saluvanta.com',
                'id_ciudad' => 11001, // Bogotá
                'id_estado' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($data as $item) {
            DB::table('empresa')->updateOrInsert(['nit' => $item['nit']], $item);
        }
    }
}