<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartamentoSeeder extends Seeder
{
    public function run(): void
    {
        $departamentos = [
            ['codigo_DANE' => 5, 'nombre' => 'Antioquia'],
            ['codigo_DANE' => 8, 'nombre' => 'Atlántico'],
            ['codigo_DANE' => 11, 'nombre' => 'Bogotá, D.C.'],
            ['codigo_DANE' => 13, 'nombre' => 'Bolívar'],
            ['codigo_DANE' => 15, 'nombre' => 'Boyacá'],
            ['codigo_DANE' => 17, 'nombre' => 'Caldas'],
            ['codigo_DANE' => 18, 'nombre' => 'Caquetá'],
            ['codigo_DANE' => 19, 'nombre' => 'Cauca'],
            ['codigo_DANE' => 20, 'nombre' => 'Cesar'],
            ['codigo_DANE' => 23, 'nombre' => 'Córdoba'],
            ['codigo_DANE' => 25, 'nombre' => 'Cundinamarca'],
            ['codigo_DANE' => 27, 'nombre' => 'Chocó'],
            ['codigo_DANE' => 41, 'nombre' => 'Huila'],
            ['codigo_DANE' => 44, 'nombre' => 'La Guajira'],
            ['codigo_DANE' => 47, 'nombre' => 'Magdalena'],
            ['codigo_DANE' => 50, 'nombre' => 'Meta'],
            ['codigo_DANE' => 52, 'nombre' => 'Nariño'],
            ['codigo_DANE' => 54, 'nombre' => 'Norte de Santander'],
            ['codigo_DANE' => 63, 'nombre' => 'Quindío'],
            ['codigo_DANE' => 66, 'nombre' => 'Risaralda'],
            ['codigo_DANE' => 68, 'nombre' => 'Santander'],
            ['codigo_DANE' => 70, 'nombre' => 'Sucre'],
            ['codigo_DANE' => 73, 'nombre' => 'Tolima'],
            ['codigo_DANE' => 76, 'nombre' => 'Valle del Cauca'],
            ['codigo_DANE' => 81, 'nombre' => 'Arauca'],
            ['codigo_DANE' => 85, 'nombre' => 'Casanare'],
            ['codigo_DANE' => 86, 'nombre' => 'Putumayo'],
            ['codigo_DANE' => 88, 'nombre' => 'San Andrés y Providencia'],
            ['codigo_DANE' => 91, 'nombre' => 'Amazonas'],
            ['codigo_DANE' => 94, 'nombre' => 'Guainía'],
            ['codigo_DANE' => 95, 'nombre' => 'Guaviare'],
            ['codigo_DANE' => 97, 'nombre' => 'Vaupés'],
            ['codigo_DANE' => 99, 'nombre' => 'Vichada'],
        ];

        foreach ($departamentos as $depto) {
            DB::table('departamento')->updateOrInsert(
                ['codigo_DANE' => $depto['codigo_DANE']],
                [
                    'nombre' => $depto['nombre'],
                    'id_estado' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}