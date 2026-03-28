<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoDocumentoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['id_tipo_documento' => 1, 'tipo_documento' => 'Cedula de Ciudadania', 'id_estado' => 1],
            ['id_tipo_documento' => 2, 'tipo_documento' => 'Tarjeta de Identidad', 'id_estado' => 1],
            ['id_tipo_documento' => 3, 'tipo_documento' => 'Cedula Extranjeria', 'id_estado' => 1],
            ['id_tipo_documento' => 4, 'tipo_documento' => 'Pasaporte', 'id_estado' => 1],
            ['id_tipo_documento' => 5, 'tipo_documento' => 'Registro Civil', 'id_estado' => 1],
            ['id_tipo_documento' => 6, 'tipo_documento' => 'Permiso Especial de Permanencia', 'id_estado' => 1],
        ];

        foreach ($tipos as $tipo) {
            DB::table('tipo_documento')->updateOrInsert(
                ['id_tipo_documento' => $tipo['id_tipo_documento']],
                [
                    'tipo_documento' => $tipo['tipo_documento'],
                    'id_estado' => $tipo['id_estado'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
