<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EspecialidadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $especialidades = [
            ['especialidad' => 'Medicina General'],
            ['especialidad' => 'Cardiología'],
            ['especialidad' => 'Pediatría'],
            ['especialidad' => 'Dermatología'],
            ['especialidad' => 'Ginecología'],
            ['especialidad' => 'Neurología'],
            ['especialidad' => 'Psiquiatría'],
            ['especialidad' => 'Oftalmología'],
            ['especialidad' => 'Ortopedia'],
            ['especialidad' => 'Otorrinolaringología'],
        ];

        \Illuminate\Support\Facades\DB::table('especialidades')->insert($especialidades);
    }
}
