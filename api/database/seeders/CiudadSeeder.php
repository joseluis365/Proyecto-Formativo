<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CiudadSeeder extends Seeder
{
    public function run(): void
    {
        $ciudades = [
            ['codigo_postal' => 5001, 'nombre' => 'Medellín', 'id_departamento' => 5],
            ['codigo_postal' => 8001, 'nombre' => 'Barranquilla', 'id_departamento' => 8],
            ['codigo_postal' => 11001, 'nombre' => 'Bogotá, D.C.', 'id_departamento' => 11],
            ['codigo_postal' => 13001, 'nombre' => 'Cartagena de Indias', 'id_departamento' => 13],
            ['codigo_postal' => 15001, 'nombre' => 'Tunja', 'id_departamento' => 15],
            ['codigo_postal' => 17001, 'nombre' => 'Manizales', 'id_departamento' => 17],
            ['codigo_postal' => 19001, 'nombre' => 'Popayán', 'id_departamento' => 19],
            ['codigo_postal' => 20001, 'nombre' => 'Valledupar', 'id_departamento' => 20],
            ['codigo_postal' => 23001, 'nombre' => 'Montería', 'id_departamento' => 23],
            ['codigo_postal' => 25001, 'nombre' => 'Agua de Dios', 'id_departamento' => 25],
            ['codigo_postal' => 27001, 'nombre' => 'Quibdó', 'id_departamento' => 27],
            ['codigo_postal' => 41001, 'nombre' => 'Neiva', 'id_departamento' => 41],
            ['codigo_postal' => 44001, 'nombre' => 'Riohacha', 'id_departamento' => 44],
            ['codigo_postal' => 47001, 'nombre' => 'Santa Marta', 'id_departamento' => 47],
            ['codigo_postal' => 50001, 'nombre' => 'Villavicencio', 'id_departamento' => 50],
            ['codigo_postal' => 52001, 'nombre' => 'Pasto', 'id_departamento' => 52],
            ['codigo_postal' => 54001, 'nombre' => 'Cúcuta', 'id_departamento' => 54],
            ['codigo_postal' => 63001, 'nombre' => 'Armenia', 'id_departamento' => 63],
            ['codigo_postal' => 66001, 'nombre' => 'Pereira', 'id_departamento' => 66],
            ['codigo_postal' => 68001, 'nombre' => 'Bucaramanga', 'id_departamento' => 68],
            ['codigo_postal' => 70001, 'nombre' => 'Sincelejo', 'id_departamento' => 70],
            ['codigo_postal' => 73001, 'nombre' => 'Ibagué', 'id_departamento' => 73],
            ['codigo_postal' => 76001, 'nombre' => 'Cali', 'id_departamento' => 76],
            ['codigo_postal' => 81001, 'nombre' => 'Arauca', 'id_departamento' => 81],
            ['codigo_postal' => 85001, 'nombre' => 'Yopal', 'id_departamento' => 85],
            ['codigo_postal' => 86001, 'nombre' => 'Mocoa', 'id_departamento' => 86],
            ['codigo_postal' => 88001, 'nombre' => 'San Andrés', 'id_departamento' => 88],
            ['codigo_postal' => 91001, 'nombre' => 'Leticia', 'id_departamento' => 91],
            ['codigo_postal' => 94001, 'nombre' => 'Inírida', 'id_departamento' => 94],
            ['codigo_postal' => 95001, 'nombre' => 'San José del Guaviare', 'id_departamento' => 95],
            ['codigo_postal' => 97001, 'nombre' => 'Mitú', 'id_departamento' => 97],
            ['codigo_postal' => 99001, 'nombre' => 'Puerto Carreño', 'id_departamento' => 99],
            // Data from final.sql
            ['codigo_postal' => 730026, 'nombre' => 'Alvarado', 'id_departamento' => 73],
            ['codigo_postal' => 730030, 'nombre' => 'Ambalema', 'id_departamento' => 73],
        ];

        foreach ($ciudades as $ciudad) {
            DB::table('ciudad')->updateOrInsert(
                ['codigo_postal' => $ciudad['codigo_postal']],
                [
                    'nombre' => $ciudad['nombre'],
                    'id_departamento' => $ciudad['id_departamento'],
                    'id_estado' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}