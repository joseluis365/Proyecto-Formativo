<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RecepcionistaSeeder extends Seeder
{
    public function run(): void
    {
        // No Role 7 (Recepcionista) users found in final.sql.
        // Keeping a single test recepcionista for dev use.
        $data = [
            [
                'documento'          => 1004567890,
                'primer_nombre'      => 'Ana',
                'segundo_nombre'     => 'Maria',
                'primer_apellido'    => 'Martinez',
                'segundo_apellido'   => 'Rodriguez',
                'email'              => 'recepcion@eps.com',
                'telefono'           => '3009876543',
                'direccion'          => 'Avenida 15 # 45-67',
                'sexo'               => 'Femenino',
                'fecha_nacimiento'   => '1992-11-30',
                'grupo_sanguineo'    => 'B+',
                'contrasena'         => Hash::make('Qwerty123.'),
                'registro_profesional'=> null,
                'nit'                => '900123456-5',
                'id_rol'             => 3,
                'id_estado'          => 1,
                'id_especialidad'    => null,
                'id_farmacia'        => null,
                'id_consultorio'     => null,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
        ];

        foreach ($data as $item) {
            DB::table('usuario')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}
