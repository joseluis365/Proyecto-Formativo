<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FarmaciaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'nit' => '900123456-5', // Linked EPS
                'nombre' => 'Farmacia Saluvanta Central',
                'direccion' => 'Calle 100 # 45-67 PBX',
                'telefono' => '3001234567',
                'email' => 'farmacia@saluvanta.com',
                'nombre_contacto' => 'Pedro Hernandez',
                'horario_apertura' => '06:00:00',
                'horario_cierre' => '22:00:00',
                'abierto_24h' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nit' => '901234567-8', // Secondary
                'nombre' => 'Farmacia Saluvanta 24H',
                'direccion' => 'Avenida Principal # 12-34',
                'telefono' => '3209876543',
                'email' => 'urgencias@saluvanta.com',
                'nombre_contacto' => 'Maria Fernandez',
                'horario_apertura' => '00:00:00',
                'horario_cierre' => '23:59:00',
                'abierto_24h' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($data as $item) {
            DB::table('farmacia')->updateOrInsert(['nit' => $item['nit']], $item);
        }
    }
}
