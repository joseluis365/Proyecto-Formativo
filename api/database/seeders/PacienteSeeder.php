<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PacienteSeeder extends Seeder
{
    public function run(): void
    {
        $pass = Hash::make('Qwerty123.');

        // Exact Role 5 user from final.sql
        $data = [
            [
                'documento'          => 121212121,
                'primer_nombre'      => 'Jose',
                'segundo_nombre'     => 'Luis',
                'primer_apellido'    => 'Rodriguez',
                'segundo_apellido'   => 'Avila',
                'email'              => 'jose.luis2020rodriguez.a@gmail.com',
                'telefono'           => '3138621212',
                'direccion'          => 'calle 14 # 2',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '2016-06-22',
                'grupo_sanguineo'    => 'A+',
                'contrasena'         => $pass,
                'registro_profesional'=> null,
                'nit'                => '900123456-5',
                'id_rol'             => 5,
                'id_estado'          => 1,
                'id_especialidad'    => null,
                'id_farmacia'        => null,
                'id_consultorio'     => null,
                'id_tipo_documento'  => 2,
                'examenes'           => false,
                'created_at'         => '2026-03-21 21:53:09',
                'updated_at'         => '2026-03-21 22:50:49',
            ],
        ];

        foreach ($data as $item) {
            DB::table('usuario')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}
