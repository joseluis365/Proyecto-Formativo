<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoDocumentoSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_tipo_documento' => 1, 'tipo_documento' => 'Cedula de Ciudadania', 'id_estado' => 1, 'created_at' => null, 'updated_at' => null],
            ['id_tipo_documento' => 2, 'tipo_documento' => 'Tarjeta de Identidad',  'id_estado' => 1, 'created_at' => null, 'updated_at' => null],
            ['id_tipo_documento' => 3, 'tipo_documento' => 'Cedula Extranjeria',     'id_estado' => 1, 'created_at' => '2026-03-21 14:05:41', 'updated_at' => '2026-03-21 14:05:41'],
        ];

        foreach ($data as $item) {
            DB::table('tipo_documento')->updateOrInsert(['id_tipo_documento' => $item['id_tipo_documento']], $item);
        }
    }
}
