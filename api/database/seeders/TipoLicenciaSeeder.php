<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id_tipo_licencia' => 23,
                'tipo' => 'Anual',
                'descripcion' => 'Licencia de un año',
                'duracion_meses' => 12,
                'precio' => '1500000.00',
                'id_estado' => 1,
                'created_at' => '2026-02-25 21:19:10',
                'updated_at' => '2026-03-06 18:39:43',
            ],
            [
                'id_tipo_licencia' => 28,
                'tipo' => 'Semestral',
                'descripcion' => 'Licencia de 6 meses',
                'duracion_meses' => 6,
                'precio' => '800000.00',
                'id_estado' => 1,
                'created_at' => '2026-03-20 21:00:23',
                'updated_at' => '2026-03-20 21:00:23',
            ],
            [
                'id_tipo_licencia' => 29,
                'tipo' => 'Trimestral',
                'descripcion' => 'Licencia de 3 meses',
                'duracion_meses' => 3,
                'precio' => '450000.00',
                'id_estado' => 1,
                'created_at' => '2026-03-20 21:04:09',
                'updated_at' => '2026-03-20 21:04:09',
            ],
        ];

        foreach ($data as $item) {
            DB::table('tipo_licencia')->updateOrInsert(['id_tipo_licencia' => $item['id_tipo_licencia']], $item);
        }
    }
}
