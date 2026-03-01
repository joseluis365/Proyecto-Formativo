<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EspecialidadSeeder extends Seeder
{
    public function run(): void
    {
        $especialidades = [
            ['id_especialidad' => 1,  'especialidad' => 'Medicina General'],
            ['id_especialidad' => 2,  'especialidad' => 'Pediatría'],
            ['id_especialidad' => 3,  'especialidad' => 'Medicina Interna'],
            ['id_especialidad' => 4,  'especialidad' => 'Cardiología'],
            ['id_especialidad' => 5,  'especialidad' => 'Traumatología'],
            ['id_especialidad' => 6,  'especialidad' => 'Ginecología'],
            ['id_especialidad' => 7,  'especialidad' => 'Neurología'],
            ['id_especialidad' => 8,  'especialidad' => 'Neumología'],
            ['id_especialidad' => 9,  'especialidad' => 'Dermatología'],
            ['id_especialidad' => 10, 'especialidad' => 'Oftalmología'],
        ];

        foreach ($especialidades as $especialidad) {
            DB::table('especialidad')->updateOrInsert(
                ['id_especialidad' => $especialidad['id_especialidad']],
                $especialidad
            );
        }
    }
}
