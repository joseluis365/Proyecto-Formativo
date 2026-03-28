<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id_empresa_licencia' => 'LIC-0001',
                'nit' => '900123456-5',
                'id_tipo_licencia' => 23, // Anual
                'fecha_inicio' => '2024-01-01',
                'fecha_fin' => '2030-12-31',
                'id_estado' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($data as $item) {
            DB::table('empresa_licencia')->updateOrInsert(['id_empresa_licencia' => $item['id_empresa_licencia']], $item);
        }
    }
}