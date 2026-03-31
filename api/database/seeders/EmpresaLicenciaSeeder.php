<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        // Exact data from final.sql
        $data = [
            [
                'id_empresa_licencia' => '238493ZJPUDX',
                'nit'                 => '900123456-5',
                'id_tipo_licencia'    => 23,
                'fecha_inicio'        => '2026-02-02',
                'fecha_fin'           => '2027-02-02',
                'id_estado'           => 1,
                'created_at'          => '2026-03-06 18:22:03',
                'updated_at'          => '2026-03-06 18:50:26',
            ],
            [
                'id_empresa_licencia' => '559744GDPNTZ',
                'nit'                 => '909090909-1',
                'id_tipo_licencia'    => 23,
                'fecha_inicio'        => '2026-03-08',
                'fecha_fin'           => '2027-03-08',
                'id_estado'           => 1,
                'created_at'          => '2026-03-08 16:25:04',
                'updated_at'          => '2026-03-08 16:25:18',
            ],
        ];

        foreach ($data as $item) {
            DB::table('empresa_licencia')->updateOrInsert(['id_empresa_licencia' => $item['id_empresa_licencia']], $item);
        }
    }
}