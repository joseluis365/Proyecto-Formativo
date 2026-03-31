<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MotivoConsultaSeeder extends Seeder
{
    public function run(): void
    {
        // Exact 51 motivos from final.sql with original IDs
        $data = [
            ['id_motivo' => 1,  'motivo' => 'Dolor de cabeza frecuente o migraña',                            'id_estado' => 2, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-27 17:22:18'],
            ['id_motivo' => 2,  'motivo' => 'Fiebre sin causa aparente',                                       'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 3,  'motivo' => 'Dolor abdominal o malestar digestivo',                            'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 4,  'motivo' => 'Tos persistente o dificultad respiratoria leve',                 'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 5,  'motivo' => 'Dolor de garganta o irritación al tragar',                       'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 6,  'motivo' => 'Resfriado común o síntomas gripales',                            'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 7,  'motivo' => 'Diarrea o alteraciones intestinales',                             'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 8,  'motivo' => 'Náuseas o vómitos recurrentes',                                  'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 9,  'motivo' => 'Dolor muscular o corporal general',                               'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 10, 'motivo' => 'Dolor lumbar o de espalda',                                      'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 11, 'motivo' => 'Dolor en articulaciones (rodillas, hombros, etc.)',               'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 12, 'motivo' => 'Lesión leve o golpe reciente',                                   'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 13, 'motivo' => 'Revisión médica general o chequeo preventivo',                   'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 14, 'motivo' => 'Control de enfermedades crónicas (diabetes, hipertensión)',       'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 15, 'motivo' => 'Cansancio excesivo o fatiga constante',                          'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 16, 'motivo' => 'Mareos o sensación de desmayo',                                  'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 17, 'motivo' => 'Problemas de sueño (insomnio, sueño irregular)',                 'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 18, 'motivo' => 'Ansiedad o crisis de angustia',                                  'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 19, 'motivo' => 'Síntomas de depresión o tristeza persistente',                   'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 20, 'motivo' => 'Estrés laboral o académico',                                     'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 21, 'motivo' => 'Problemas emocionales o personales',                             'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 22, 'motivo' => 'Dificultades en relaciones interpersonales',                     'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 23, 'motivo' => 'Problemas de conducta en niños',                                 'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 24, 'motivo' => 'Control de crecimiento y desarrollo infantil',                   'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 25, 'motivo' => 'Vacunación o esquema de vacunas',                                'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 26, 'motivo' => 'Erupciones en la piel o alergias',                               'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 27, 'motivo' => 'Picazón o irritación cutánea',                                   'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 28, 'motivo' => 'Heridas leves o infecciones superficiales',                      'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 29, 'motivo' => 'Dolor dental o molestias bucales',                               'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 30, 'motivo' => 'Sangrado nasal ocasional',                                       'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 31, 'motivo' => 'Problemas visuales leves (visión borrosa, cansancio ocular)',    'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 32, 'motivo' => 'Dolor de oído o molestias auditivas',                            'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 33, 'motivo' => 'Congestión nasal o sinusitis leve',                              'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 34, 'motivo' => 'Control prenatal básico',                                        'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 35, 'motivo' => 'Alteraciones menstruales o dolor menstrual',                     'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 36, 'motivo' => 'Infecciones urinarias leves',                                    'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 37, 'motivo' => 'Dolor al orinar o cambios urinarios',                            'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 38, 'motivo' => 'Control de peso o asesoría nutricional',                         'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 39, 'motivo' => 'Obesidad o sobrepeso',                                           'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 40, 'motivo' => 'Pérdida de peso sin causa clara',                                'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 41, 'motivo' => 'Problemas de alimentación en niños',                             'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 42, 'motivo' => 'Dolor en el pecho leve no urgente',                              'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 43, 'motivo' => 'Palpitaciones o ritmo cardíaco irregular leve',                  'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 44, 'motivo' => 'Seguimiento post enfermedad reciente',                           'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 45, 'motivo' => 'Reacciones alérgicas leves',                                     'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 46, 'motivo' => 'Consulta por hábitos saludables',                                'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 47, 'motivo' => 'Problemas de concentración o atención',                          'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 48, 'motivo' => 'Cambios de humor frecuentes',                                    'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 49, 'motivo' => 'Evaluación médica para actividad física o deporte',              'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 50, 'motivo' => 'Consulta general sin síntoma específico (orientación médica)',   'id_estado' => 1, 'created_at' => '2026-03-20 14:51:19', 'updated_at' => '2026-03-20 14:51:19'],
            ['id_motivo' => 51, 'motivo' => 'Otro',                                                           'id_estado' => 1, 'created_at' => '2026-03-23 20:49:00', 'updated_at' => '2026-03-23 20:49:00'],
        ];

        foreach ($data as $item) {
            DB::table('motivo_consulta')->updateOrInsert(['id_motivo' => $item['id_motivo']], $item);
        }
    }
}
