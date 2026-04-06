<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $pass = Hash::make('Qwerty123.');

        // From final.sql: Role 2 (Admin) and Role 3 (Personal Administrativo)
        $data = [
            // Role 2 - Admin
            [
                'documento'          => 12345671,
                'primer_nombre'      => 'Juan',
                'segundo_nombre'     => 'Jose',
                'primer_apellido'    => 'Rodriguez',
                'segundo_apellido'   => 'Martinez',
                'email'              => 'joseluis1409rodriguez@gmail.com',
                'telefono'           => '3123213433',
                'direccion'          => 'calle 34',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '2004-02-17',
                'grupo_sanguineo'    => 'A+',
                'contrasena'         => $pass,
                'registro_profesional'=> null,
                'nit'                => '900123456-5',
                'id_rol'             => 2,
                'id_estado'          => 1,
                'id_especialidad'    => 1,
                'id_farmacia'        => '298765432-1',
                'id_consultorio'     => 2,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => '2026-03-06 18:22:03',
                'updated_at'         => '2026-03-27 16:46:53',
            ],
            [
                'documento'          => 11000111,
                'primer_nombre'      => 'Cesar',
                'segundo_nombre'     => 'Arturo',
                'primer_apellido'    => 'Esquivel',
                'segundo_apellido'   => 'Cortes',
                'email'              => 'esquivel7809@gmail.com',
                'telefono'           => '3114333333',
                'direccion'          => 'calle 34 # 2-42',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '2004-02-17',
                'grupo_sanguineo'    => 'A+',
                'contrasena'         => Hash::make('Qwerty22026%&2'),
                'registro_profesional'=> null,
                'nit'                => '900123456-5',
                'id_rol'             => 2,
                'id_estado'          => 1,
                'id_especialidad'    => 1,
                'id_farmacia'        => '298765432-1',
                'id_consultorio'     => 2,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => '2026-03-06 18:22:03',
                'updated_at'         => '2026-03-27 16:46:53',
            ],
            // Role 3 - Personal Administrativo (examenes=true -> encargado de exámenes)
            [
                'documento'          => 110345212,
                'primer_nombre'      => 'Alejandro',
                'segundo_nombre'     => null,
                'primer_apellido'    => 'Diagama',
                'segundo_apellido'   => 'Avila',
                'email'              => 'examenes@gmail.com',
                'telefono'           => '3124564322',
                'direccion'          => 'calle 14 # 2-42',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '2006-06-06',
                'grupo_sanguineo'    => null,
                'contrasena'         => $pass,
                'registro_profesional'=> null,
                'nit'                => '900123456-5',
                'id_rol'             => 3,
                'id_estado'          => 1,
                'id_especialidad'    => null,
                'id_farmacia'        => null,
                'id_consultorio'     => null,
                'id_tipo_documento'  => 1,
                'examenes'           => true,
                'created_at'         => '2026-03-21 21:44:03',
                'updated_at'         => '2026-03-21 22:00:56',
            ],
            // Role 3 - Personal Administrativo (recepcionista/general)
            [
                'documento'          => 11021221,
                'primer_nombre'      => 'Jorge',
                'segundo_nombre'     => null,
                'primer_apellido'    => 'Ramirez',
                'segundo_apellido'   => null,
                'email'              => 'personal@gmail.com',
                'telefono'           => '3125121610',
                'direccion'          => 'calle 14 # 2-42',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '2001-10-17',
                'grupo_sanguineo'    => null,
                'contrasena'         => $pass,
                'registro_profesional'=> null,
                'nit'                => '900123456-5',
                'id_rol'             => 3,
                'id_estado'          => 1,
                'id_especialidad'    => null,
                'id_farmacia'        => null,
                'id_consultorio'     => null,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => '2026-03-21 22:02:30',
                'updated_at'         => '2026-03-21 22:02:30',
            ],
        ];

        foreach ($data as $item) {
            DB::table('usuario')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}