<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PacienteSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'documento' => 1002345678,
                'primer_nombre' => 'Maria',
                'segundo_nombre' => 'Fernanda',
                'primer_apellido' => 'Lopez',
                'segundo_apellido' => 'Garcia',
                'email' => 'paciente1@eps.com',
                'telefono' => '3109876543',
                'direccion' => 'Calle 45 # 12-34',
                'sexo' => 'Femenino',
                'fecha_nacimiento' => '1990-05-15',
                'grupo_sanguineo' => 'O+',
                'contrasena' => Hash::make('Qwerty123.'),
                'nit' => '900123456-5',
                'id_rol' => 5,
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
