<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FarmaceutaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'documento' => 1001234567,
                'primer_nombre' => 'Juan',
                'segundo_nombre' => 'Camilo',
                'primer_apellido' => 'Garcia',
                'segundo_apellido' => 'Perez',
                'email' => 'farmaceuta1@eps.com',
                'telefono' => '3151234567',
                'direccion' => 'Calle 100 # 15-20',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '1988-03-25',
                'grupo_sanguineo' => 'O-',
                'contrasena' => Hash::make('Qwerty123.'),
                'nit' => '900123456-5',
                'id_rol' => 2,
                'id_estado' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'documento' => 2987654321,
                'primer_nombre' => 'Jose',
                'segundo_nombre' => null,
                'primer_apellido' => 'Martinez',
                'segundo_apellido' => null,
                'email' => 'joser223@gmail.com',
                'telefono' => '23',
                'direccion' => 'calle 24',
                'sexo' => null,
                'fecha_nacimiento' => null,
                'grupo_sanguineo' => null,
                'contrasena' => Hash::make('Qwerty123.'),
                'nit' => '900123456-5',
                'id_rol' => 2,
                'id_estado' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($data as $item) {
            DB::table('usuario')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}
