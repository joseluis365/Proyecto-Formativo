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
        $now = Carbon::now();
        $defaultPassword = Hash::make('Qwerty123.');

        $data = [
            [
                'documento' => 1003456789,
                'primer_nombre' => 'Carlos',
                'segundo_nombre' => 'Andres',
                'primer_apellido' => 'Perez',
                'segundo_apellido' => 'Gomez',
                'email' => 'medico1@eps.com',
                'telefono' => '3201234567',
                'direccion' => 'Carrera 7 # 12-34',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '1985-08-20',
                'grupo_sanguineo' => 'A+',
                'contrasena' => $defaultPassword,
                'registro_profesional' => '12345-MED',
                'nit' => '900123456-5',
                'id_rol' => 3,
                'id_estado' => 1,
                'id_especialidad' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        ];

        $especialidades = [
            'Medicina General', 'Pediatria', 'Ginecologia', 'Cardiologia', 
            'Dermatologia', 'Odontologia', 'Oftalmologia', 'Psicologia', 
            'Traumatologia', 'Nutricion', 'Fisioterapia'
        ];

        foreach ($especialidades as $index => $esp) {
            $id_esp = $index + 1;
            $doc = 2000000000 + $id_esp;
            
            $data[] = [
                'documento' => $doc,
                'primer_nombre' => 'Doctor',
                'segundo_nombre' => null,
                'primer_apellido' => str_replace(' ', '', $esp),
                'segundo_apellido' => 'Saluvanta',
                'email' => strtolower("dr." . str_replace(' ', '', $esp) . "@saluvanta.com"),
                'telefono' => '30000000' . sprintf('%02d', $id_esp),
                'direccion' => 'Sede Central EPS',
                'sexo' => ($id_esp % 2 == 0) ? 'Femenino' : 'Masculino',
                'fecha_nacimiento' => '1980-01-01',
                'grupo_sanguineo' => 'O+',
                'contrasena' => $defaultPassword,
                'registro_profesional' => "99999-ESP{$id_esp}",
                'nit' => '900123456-5',
                'id_rol' => 3,
                'id_estado' => 1,
                'id_especialidad' => $id_esp,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach ($data as $item) {
            DB::table('usuario')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}
