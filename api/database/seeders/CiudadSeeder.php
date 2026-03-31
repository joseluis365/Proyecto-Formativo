<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CiudadSeeder extends Seeder
{
    public function run(): void
    {
        // All 48 cities from final.sql with exact IDs + common capital cities of other departments
        $ciudades = [
            // === TOLIMA (from final.sql, exact) ===
            ['codigo_postal' => 730001, 'nombre' => 'Ibagué',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730024, 'nombre' => 'Alpujarra',           'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730026, 'nombre' => 'Alvarado',            'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730030, 'nombre' => 'Ambalema',            'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730043, 'nombre' => 'Anzoátegui',          'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730055, 'nombre' => 'Armero',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730067, 'nombre' => 'Ataco',               'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730124, 'nombre' => 'Cajamarca',           'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730148, 'nombre' => 'Carmen de Apicalá',   'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730152, 'nombre' => 'Casabianca',          'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730168, 'nombre' => 'Chaparral',           'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730200, 'nombre' => 'Coello',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730217, 'nombre' => 'Coyaima',             'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730226, 'nombre' => 'Cunday',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730236, 'nombre' => 'Dolores',             'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730268, 'nombre' => 'Espinal',             'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730270, 'nombre' => 'Falan',               'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730275, 'nombre' => 'Flandes',             'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730283, 'nombre' => 'Fresno',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730319, 'nombre' => 'Guamo',               'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730347, 'nombre' => 'Herveo',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730349, 'nombre' => 'Honda',               'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730352, 'nombre' => 'Icononzo',            'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730408, 'nombre' => 'Lérida',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730411, 'nombre' => 'Líbano',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730443, 'nombre' => 'Mariquita',           'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730449, 'nombre' => 'Melgar',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730461, 'nombre' => 'Murillo',             'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730483, 'nombre' => 'Natagaima',           'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730504, 'nombre' => 'Ortega',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730520, 'nombre' => 'Palocabildo',         'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730547, 'nombre' => 'Piedras',             'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730555, 'nombre' => 'Planadas',            'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730563, 'nombre' => 'Prado',               'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730585, 'nombre' => 'Purificación',        'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730616, 'nombre' => 'Rioblanco',           'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730622, 'nombre' => 'Roncesvalles',        'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730624, 'nombre' => 'Rovira',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730671, 'nombre' => 'Saldaña',             'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730675, 'nombre' => 'San Antonio',         'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730678, 'nombre' => 'San Luis',            'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730686, 'nombre' => 'Santa Isabel',        'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730770, 'nombre' => 'Suárez',              'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730854, 'nombre' => 'Valle de San Juan',   'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730861, 'nombre' => 'Venadillo',           'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730870, 'nombre' => 'Villahermosa',        'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            ['codigo_postal' => 730873, 'nombre' => 'Villarrica',          'id_departamento' => 73, 'id_estado' => 1, 'created_at' => '2026-02-18 09:16:48', 'updated_at' => '2026-03-01 20:48:46'],
            // === ANTIOQUIA (from final.sql) ===
            ['codigo_postal' => 73221,  'nombre' => 'Medellin',            'id_departamento' => 11, 'id_estado' => 1, 'created_at' => '2026-03-27 13:25:21', 'updated_at' => '2026-03-27 13:25:21'],
            // === Other department capitals ===
            ['codigo_postal' => 8001,   'nombre' => 'Barranquilla',        'id_departamento' => 5,  'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 11001,  'nombre' => 'Bogotá, D.C.',        'id_departamento' => 8,  'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 13001,  'nombre' => 'Cartagena de Indias', 'id_departamento' => 13, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 15001,  'nombre' => 'Tunja',               'id_departamento' => 15, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 17001,  'nombre' => 'Manizales',           'id_departamento' => 17, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 19001,  'nombre' => 'Popayán',             'id_departamento' => 19, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 20001,  'nombre' => 'Valledupar',          'id_departamento' => 20, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 23001,  'nombre' => 'Montería',            'id_departamento' => 23, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 25001,  'nombre' => 'Agua de Dios',        'id_departamento' => 25, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 27001,  'nombre' => 'Quibdó',              'id_departamento' => 27, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 41001,  'nombre' => 'Neiva',               'id_departamento' => 41, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 44001,  'nombre' => 'Riohacha',            'id_departamento' => 44, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 47001,  'nombre' => 'Santa Marta',         'id_departamento' => 47, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 50001,  'nombre' => 'Villavicencio',       'id_departamento' => 50, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 52001,  'nombre' => 'Pasto',               'id_departamento' => 52, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 54001,  'nombre' => 'Cúcuta',              'id_departamento' => 54, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 63001,  'nombre' => 'Armenia',             'id_departamento' => 63, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 66001,  'nombre' => 'Pereira',             'id_departamento' => 66, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 68001,  'nombre' => 'Bucaramanga',         'id_departamento' => 68, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 70001,  'nombre' => 'Sincelejo',           'id_departamento' => 70, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 76001,  'nombre' => 'Cali',                'id_departamento' => 76, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 81001,  'nombre' => 'Arauca',              'id_departamento' => 81, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 85001,  'nombre' => 'Yopal',               'id_departamento' => 85, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 86001,  'nombre' => 'Mocoa',               'id_departamento' => 86, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 88001,  'nombre' => 'San Andrés',          'id_departamento' => 88, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 91001,  'nombre' => 'Leticia',             'id_departamento' => 91, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 94001,  'nombre' => 'Inírida',             'id_departamento' => 94, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 95001,  'nombre' => 'San José del Guaviare','id_departamento' => 95,'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 97001,  'nombre' => 'Mitú',                'id_departamento' => 97, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['codigo_postal' => 99001,  'nombre' => 'Puerto Carreño',      'id_departamento' => 99, 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($ciudades as $ciudad) {
            DB::table('ciudad')->updateOrInsert(['codigo_postal' => $ciudad['codigo_postal']], $ciudad);
        }
    }
}