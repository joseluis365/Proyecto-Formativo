<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Rol;
use App\Models\Estado;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UsuariosPruebaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener IDs de estados y roles por nombre para evitar hardcoding
        $estadoActivo = Estado::where('nombre_estado', 'Activo')->first();
        $rolMedico = Rol::where('tipo_usu', 'Medico')->first();
        $rolPaciente = Rol::where('tipo_usu', 'Paciente')->first();
        $empresa = \App\Models\Empresa::first();

        // Validar que existan los registros base antes de sembrar
        if (!$estadoActivo || !$rolMedico || !$rolPaciente || !$empresa) {
            $this->command->error('No se encontraron los roles, estados base o empresa. Por favor ejecute RolSeeder, EstadoSeeder y EmpresaSeeder primero.');
            return;
        }

        // 1. Médico de Prueba
        Usuario::updateOrCreate(
            ['documento' => 200000001],
            [
                'primer_nombre' => 'Carlos',
                'segundo_nombre' => 'Alberto',
                'primer_apellido' => 'Pérez',
                'segundo_apellido' => 'Rodríguez',
                'email' => 'medico.prueba@eps.com',
                'telefono' => '3002222222',
                'direccion' => 'Calle 100 #20-30',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '1985-05-15',
                'grupo_sanguineo' => 'O+',
                'contrasena' => 'password123', // El modelo Usuario tiene un mutator que hace el Hash
                'registro_profesional' => 'MP-12345',
                'nit' => $empresa->nit,
                'id_rol' => $rolMedico->id_rol,
                'id_estado' => $estadoActivo->id_estado,
                'id_especialidad' => 1, // Medicina General
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );

        // 2. Paciente de Prueba
        Usuario::updateOrCreate(
            ['documento' => 300000001],
            [
                'primer_nombre' => 'Juan',
                'segundo_nombre' => 'David',
                'primer_apellido' => 'Gómez',
                'segundo_apellido' => 'Marín',
                'email' => 'paciente.prueba@eps.com',
                'telefono' => '3003333333',
                'direccion' => 'Carrera 50 #10-40',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '1995-10-20',
                'grupo_sanguineo' => 'A+',
                'contrasena' => 'password123', // El modelo Usuario tiene un mutator que hace el Hash
                'registro_profesional' => null,
                'nit' => $empresa->nit,
                'id_rol' => $rolPaciente->id_rol,
                'id_estado' => $estadoActivo->id_estado,
                'id_especialidad' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );

        $this->command->info('Usuarios de prueba (Médico y Paciente) creados correctamente.');
    }
}
