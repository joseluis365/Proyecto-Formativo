<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MedicoSeeder extends Seeder
{
    public function run(): void
    {
        $pass = Hash::make('Qwerty123.');

        // Specialties from final.sql with exact IDs
        $especialidades = [
            1  => 'Medicina General',
            2  => 'Pediatría',
            3  => 'Medicina Interna',
            4  => 'Cardiología',
            5  => 'Traumatología',
            6  => 'Ginecología',
            7  => 'Neurología',
            8  => 'Neumología',
            9  => 'Dermatología',
            10 => 'Oftalmología',
            11 => 'Cardiologia',
        ];

        // Exact Role 4 users from final.sql
        $fromSQL = [
            [
                'documento'          => 11047812,
                'primer_nombre'      => 'Andres',
                'segundo_nombre'     => null,
                'primer_apellido'    => 'Avila',
                'segundo_apellido'   => 'Pinilla',
                'email'              => 'medico@gmail.com',
                'telefono'           => '3122111111',
                'direccion'          => 'calle 14 # 2-41',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '2007-07-19',
                'grupo_sanguineo'    => null,
                'contrasena'         => $pass,
                'registro_profesional'=> '121221211',
                'nit'                => '900123456-5',
                'id_rol'             => 4,
                'id_estado'          => 1,
                'id_especialidad'    => 1,
                'id_farmacia'        => null,
                'id_consultorio'     => 1,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => '2026-03-21 21:49:41',
                'updated_at'         => '2026-03-21 21:59:54',
            ],
            [
                'documento'          => 12121211,
                'primer_nombre'      => 'Sandra',
                'segundo_nombre'     => 'Rocio',
                'primer_apellido'    => 'Avila',
                'segundo_apellido'   => null,
                'email'              => 'especialista@gmail.com',
                'telefono'           => '3121224443',
                'direccion'          => 'calle 14 # 2-42',
                'sexo'               => 'Femenino',
                'fecha_nacimiento'   => '1998-06-09',
                'grupo_sanguineo'    => null,
                'contrasena'         => $pass,
                'registro_profesional'=> '121211111',
                'nit'                => '900123456-5',
                'id_rol'             => 4,
                'id_estado'          => 1,
                'id_especialidad'    => 6,
                'id_farmacia'        => null,
                'id_consultorio'     => 3,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => '2026-03-22 01:15:20',
                'updated_at'         => '2026-03-22 01:15:20',
            ],
        ];

        // Track which specialties and consultorios are already used
        $usedEspecialidades = [1, 6]; // Andres=1, Sandra=6
        $usedConsultorios   = [1, 3]; // Andres=1, Sandra=3

        // Insert SQL users first
        foreach ($fromSQL as $user) {
            DB::table('usuario')->updateOrInsert(['documento' => $user['documento']], $user);
        }

        // Now create one doctor per remaining specialty
        $consultorioCounter = 4; // Start from 4 (1 and 3 already used)
        $docBase = 3000000000;
        $idx = 1;

        $names = [
            ['primer' => 'Carlos',    'apellido' => 'Mendoza',   'sexo' => 'Masculino'],
            ['primer' => 'Laura',     'apellido' => 'Ospina',    'sexo' => 'Femenino'],
            ['primer' => 'Miguel',    'apellido' => 'Vargas',    'sexo' => 'Masculino'],
            ['primer' => 'Patricia',  'apellido' => 'Herrera',   'sexo' => 'Femenino'],
            ['primer' => 'Roberto',   'apellido' => 'Castro',    'sexo' => 'Masculino'],
            ['primer' => 'Claudia',   'apellido' => 'Jimenez',   'sexo' => 'Femenino'],
            ['primer' => 'Fernando',  'apellido' => 'Mora',      'sexo' => 'Masculino'],
            ['primer' => 'Diana',     'apellido' => 'Reyes',     'sexo' => 'Femenino'],
            ['primer' => 'Hector',    'apellido' => 'Suarez',    'sexo' => 'Masculino'],
        ];

        foreach ($especialidades as $idEsp => $nombreEsp) {
            if (in_array($idEsp, $usedEspecialidades)) {
                continue;
            }

            $nameData = $names[($idx - 1) % count($names)];
            // Skip consultorio 2 (used by admin/prueba user)
            if ($consultorioCounter == 2) $consultorioCounter++;

            $doc = $docBase + $idx;
            $slug = strtolower(iconv('UTF-8', 'ASCII//TRANSLIT', str_replace(' ', '', $nombreEsp)));

            DB::table('usuario')->updateOrInsert(
                ['documento' => $doc],
                [
                    'documento'          => $doc,
                    'primer_nombre'      => $nameData['primer'],
                    'segundo_nombre'     => null,
                    'primer_apellido'    => $nameData['apellido'],
                    'segundo_apellido'   => 'Saluvanta',
                    'email'              => "dr.{$slug}@saluvanta.com",
                    'telefono'           => '315500' . sprintf('%04d', $idx),
                    'direccion'          => 'Sede Central Saluvanta',
                    'sexo'               => $nameData['sexo'],
                    'fecha_nacimiento'   => '1980-01-01',
                    'grupo_sanguineo'    => 'O+',
                    'contrasena'         => $pass,
                    'registro_profesional'=> 'REG-' . str_pad($idEsp, 4, '0', STR_PAD_LEFT),
                    'nit'                => '900123456-5',
                    'id_rol'             => 4,
                    'id_estado'          => 1,
                    'id_especialidad'    => $idEsp,
                    'id_farmacia'        => null,
                    'id_consultorio'     => $consultorioCounter,
                    'id_tipo_documento'  => 1,
                    'examenes'           => false,
                    'created_at'         => Carbon::now(),
                    'updated_at'         => Carbon::now(),
                ]
            );

            $consultorioCounter++;
            $idx++;
        }
    }
}
