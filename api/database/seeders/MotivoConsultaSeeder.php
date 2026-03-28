<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MotivoConsultaSeeder extends Seeder
{
    public function run(): void
    {
        $motivos = [
            'Control General',
            'Valoración Especialista',
            'Urgencia Médica',
            'Lectura de Exámenes',
            'Cefalea',
            'Dolor Abdominal',
            'Renovación de Receta',
            'Control Prenatal',
            'Vacunación',
            'Fiebre',
            'Traumatismo',
            'Dificultad Respiratoria',
            'Chequeo Preventivo',
            'Problemas Dermatológicos',
            'Control Hipertensión',
            'Control Diabetes',
            'Síntomas Gastrointestinales',
            'Infección Urinaria',
            'Alergias',
            'Dolor Articular/Muscular',
        ];

        foreach ($motivos as $index => $motivo) {
            DB::table('motivo_consulta')->updateOrInsert(
                ['id_motivo' => $index + 1],
                [
                    'motivo' => $motivo,
                    'id_estado' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
