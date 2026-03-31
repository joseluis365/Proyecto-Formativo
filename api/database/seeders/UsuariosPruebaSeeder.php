<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UsuariosPruebaSeeder extends Seeder
{
    public function run(): void
    {
        // Extra dev/testing users (médico prueba y paciente prueba)
        $pass = Hash::make('Qwerty123.');

        $empresa = DB::table('empresa')->where('id_estado', 1)->first();
        if (!$empresa) {
            $this->command->error('No se encontró empresa activa. Asegúrese de correr EmpresaSeeder primero.');
            return;
        }

        $users = [
            [
                'documento'          => 200000001,
                'primer_nombre'      => 'Carlos',
                'segundo_nombre'     => 'Alberto',
                'primer_apellido'    => 'Pérez',
                'segundo_apellido'   => 'Rodríguez',
                'email'              => 'medico.prueba@eps.com',
                'telefono'           => '3002222222',
                'direccion'          => 'Calle 100 #20-30',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '1985-05-15',
                'grupo_sanguineo'    => 'O+',
                'contrasena'         => $pass,
                'registro_profesional'=> 'MP-12345',
                'nit'                => $empresa->nit,
                'id_rol'             => 4,
                'id_estado'          => 1,
                'id_especialidad'    => 1,
                'id_farmacia'        => null,
                'id_consultorio'     => 50,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => Carbon::now(),
                'updated_at'         => Carbon::now(),
            ],
            [
                'documento'          => 300000001,
                'primer_nombre'      => 'Juan',
                'segundo_nombre'     => 'David',
                'primer_apellido'    => 'Gómez',
                'segundo_apellido'   => 'Marín',
                'email'              => 'paciente.prueba@eps.com',
                'telefono'           => '3003333333',
                'direccion'          => 'Carrera 50 #10-40',
                'sexo'               => 'Masculino',
                'fecha_nacimiento'   => '1995-10-20',
                'grupo_sanguineo'    => 'A+',
                'contrasena'         => $pass,
                'registro_profesional'=> null,
                'nit'                => $empresa->nit,
                'id_rol'             => 5,
                'id_estado'          => 1,
                'id_especialidad'    => null,
                'id_farmacia'        => null,
                'id_consultorio'     => null,
                'id_tipo_documento'  => 1,
                'examenes'           => false,
                'created_at'         => Carbon::now(),
                'updated_at'         => Carbon::now(),
            ],
        ];

        foreach ($users as $user) {
            DB::table('usuario')->updateOrInsert(['documento' => $user['documento']], $user);
        }

        $this->command->info('Usuarios de prueba (Médico y Paciente) creados correctamente.');
    }
}
