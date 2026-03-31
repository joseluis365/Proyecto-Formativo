<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FarmaceutaSeeder extends Seeder
{
    public function run(): void
    {
        $pass = Hash::make('Qwerty123.');

        // Exact Role 6 user from final.sql
        $data = [
            [
                'documento'          => 11111111,
                'primer_nombre'      => 'Nubia',
                'segundo_nombre'     => 'Jhoana',
                'primer_apellido'    => 'Avila',
                'segundo_apellido'   => 'Pinilla',
                'email'              => 'farmaceutico@gmail.com',
                'telefono'           => '3121212121',
                'direccion'          => 'carrera 50 143 - 39',
                'sexo'               => 'Femenino',
                'fecha_nacimiento'   => '2007-06-06',
                'grupo_sanguineo'    => null,
                'contrasena'         => $pass,
                'registro_profesional'=> null,
                'nit'                => '900123456-5',
                'id_rol'             => 6,
                'id_estado'          => 1,
                'id_especialidad'    => null,
                'id_farmacia'        => '900123456-7',
                'id_consultorio'     => null,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => '2026-03-21 21:55:01',
                'updated_at'         => '2026-03-21 22:00:33',
            ],
        ];

        foreach ($data as $item) {
            DB::table('usuario')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}
