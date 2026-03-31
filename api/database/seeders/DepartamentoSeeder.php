<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartamentoSeeder extends Seeder
{
    public function run(): void
    {
        // Exact data from final.sql + all Colombian departments for completeness
        $departamentos = [
            // From final.sql (exact IDs match)
            ['codigo_DANE' => 73, 'nombre' => 'Tolima',   'id_estado' => 1, 'created_at' => '2026-02-18 09:10:51', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_DANE' => 18, 'nombre' => 'Caldas',   'id_estado' => 1, 'created_at' => '2026-03-06 16:56:25', 'updated_at' => '2026-03-06 16:56:25'],
            ['codigo_DANE' => 11, 'nombre' => 'Antioquia', 'id_estado' => 1, 'created_at' => '2026-03-27 13:24:47', 'updated_at' => '2026-03-27 13:24:47'],
            // Rest of Colombia
            ['codigo_DANE' => 5,  'nombre' => 'Atlántico',              'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 8,  'nombre' => 'Bogotá, D.C.',           'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 13, 'nombre' => 'Bolívar',                'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 15, 'nombre' => 'Boyacá',                 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 17, 'nombre' => 'Caldas',                 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 19, 'nombre' => 'Cauca',                  'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 20, 'nombre' => 'Cesar',                  'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 23, 'nombre' => 'Córdoba',                'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 25, 'nombre' => 'Cundinamarca',           'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 27, 'nombre' => 'Chocó',                  'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 41, 'nombre' => 'Huila',                  'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 44, 'nombre' => 'La Guajira',             'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 47, 'nombre' => 'Magdalena',              'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 50, 'nombre' => 'Meta',                   'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 52, 'nombre' => 'Nariño',                 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 54, 'nombre' => 'Norte de Santander',     'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 63, 'nombre' => 'Quindío',                'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 66, 'nombre' => 'Risaralda',              'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 68, 'nombre' => 'Santander',              'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 70, 'nombre' => 'Sucre',                  'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 76, 'nombre' => 'Valle del Cauca',        'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 81, 'nombre' => 'Arauca',                 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 85, 'nombre' => 'Casanare',               'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 86, 'nombre' => 'Putumayo',               'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 88, 'nombre' => 'San Andrés y Providencia','id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 91, 'nombre' => 'Amazonas',               'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 94, 'nombre' => 'Guainía',                'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 95, 'nombre' => 'Guaviare',               'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 97, 'nombre' => 'Vaupés',                 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_DANE' => 99, 'nombre' => 'Vichada',                'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($departamentos as $depto) {
            // PostgreSQL column "codigo_DANE" is case-sensitive; use raw statement
            DB::table('departamento')->updateOrInsert(
                ['codigo_DANE' => $depto['codigo_DANE']],
                $depto
            );
        }
    }
}