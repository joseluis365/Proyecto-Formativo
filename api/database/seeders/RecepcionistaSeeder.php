<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RecepcionistaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'documento' => 1004567890,
                'primer_nombre' => 'Ana',
                'segundo_nombre' => 'Maria',
                'primer_apellido' => 'Martinez',
                'segundo_apellido' => 'Rodriguez',
                'email' => 'recepcion@eps.com',
                'telefono' => '3009876543',
                'direccion' => 'Avenida 15 # 45-67',
                'sexo' => 'Femenino',
                'fecha_nacimiento' => '1992-11-30',
                'grupo_sanguineo' => 'B+',
                'contrasena' => Hash::make('Qwerty123.'),
                'nit' => '900123456-5',
                'id_rol' => 4,
                'id_estado' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'documento' => 12345671,
                'primer_nombre' => 'Juan',
                'segundo_nombre' => null,
                'primer_apellido' => 'Rodriguez',
                'segundo_apellido' => null,
                'email' => 'joseluis1409rodriguez@gmail.com',
                'telefono' => '3123213433',
                'direccion' => 'calle 34',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '2004-02-17',
                'grupo_sanguineo' => 'A+',
                'contrasena' => Hash::make('Qwerty123.'),
                'nit' => '900123456-5', // Replaced \N with EPS NIT so it doesn't fail foreign keys
                'id_rol' => 4,
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
