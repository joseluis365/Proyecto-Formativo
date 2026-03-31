<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FarmaciaSeeder extends Seeder
{
    public function run(): void
    {
        // Exact data from final.sql
        $data = [
            [
                'nit'            => '900123456-7',
                'nombre'         => 'FarmaTodo',
                'direccion'      => 'calle 23 askjs',
                'telefono'       => '123456',
                'email'          => 'e@gmail.c',
                'nombre_contacto'=> 'Jose #443',
                'horario_apertura'=> '08:00:00',
                'horario_cierre' => '16:00:00',
                'abierto_24h'    => true,
                'nit_empresa'    => '909090909-1',
                'id_estado'      => 1,
                'created_at'     => '2026-03-01 20:07:37',
                'updated_at'     => '2026-03-01 20:07:37',
            ],
            [
                'nit'            => '298765432-1',
                'nombre'         => 'Sanitas',
                'direccion'      => 'calle 14 # 2-42',
                'telefono'       => '3124567890',
                'email'          => 'admin@gmail.com',
                'nombre_contacto'=> 'Jose asasas',
                'horario_apertura'=> '06:00:00',
                'horario_cierre' => '22:00:00',
                'abierto_24h'    => true,
                'nit_empresa'    => '900123456-5',
                'id_estado'      => 1,
                'created_at'     => '2026-03-06 18:56:36',
                'updated_at'     => '2026-03-06 18:56:36',
            ],
        ];

        foreach ($data as $item) {
            DB::table('farmacia')->updateOrInsert(['nit' => $item['nit']], $item);
        }
    }
}
