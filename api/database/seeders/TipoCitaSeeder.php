<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoCitaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id_tipo_cita' => 3,
                'tipo' => 'Especialista',
                'id_estado' => 1,
                'created_at' => '2026-03-06 16:51:12',
                'updated_at' => '2026-03-06 16:51:12',
                'acceso_directo' => 'f',
            ],
            [
                'id_tipo_cita' => 8,
                'tipo' => 'Cardiología',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 'f',
            ],
            [
                'id_tipo_cita' => 9,
                'tipo' => 'Dermatología',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 'f',
            ],
            [
                'id_tipo_cita' => 10,
                'tipo' => 'Oftalmología',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 'f',
            ],
            [
                'id_tipo_cita' => 11,
                'tipo' => 'Nutrición y Dietética',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 'f',
            ],
            [
                'id_tipo_cita' => 13,
                'tipo' => 'Fisioterapia',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 'f',
            ],
            [
                'id_tipo_cita' => 4,
                'tipo' => 'Medicina General',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 't',
            ],
            [
                'id_tipo_cita' => 5,
                'tipo' => 'Odontología',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 't',
            ],
            [
                'id_tipo_cita' => 6,
                'tipo' => 'Pediatría',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 't',
            ],
            [
                'id_tipo_cita' => 7,
                'tipo' => 'Ginecología',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 't',
            ],
            [
                'id_tipo_cita' => 12,
                'tipo' => 'Psicología',
                'id_estado' => 1,
                'created_at' => '2026-03-13 19:15:16',
                'updated_at' => '2026-03-13 19:15:16',
                'acceso_directo' => 't',
            ],
            [
                'id_tipo_cita' => 14,
                'tipo' => 'Psiquiatria',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 't',
            ],
        ];

        foreach ($data as $item) {
            DB::table('tipo_cita')->updateOrInsert(['id_tipo_cita' => $item['id_tipo_cita']], $item);
        }
    }
}
