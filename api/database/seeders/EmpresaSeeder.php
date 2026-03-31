<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        // Exact data from final.sql
        $data = [
            [
                'nit'                    => '909090909-1',
                'nombre'                 => 'exito',
                'email_contacto'         => 'esquivel7809@gmail.com',
                'telefono'               => '3213173993',
                'direccion'              => 'cr 5 n 12 34 bloque 2',
                'documento_representante'=> '90909090',
                'nombre_representante'   => 'cesar esquivel',
                'telefono_representante' => '3211231222',
                'email_representante'    => 'esquivel7809@gmail.com',
                'id_ciudad'              => 730001,
                'id_estado'              => 1,
                'created_at'             => '2026-02-27 22:32:32',
                'updated_at'             => '2026-02-27 22:32:32',
            ],
            [
                'nit'                    => '900123456-5',
                'nombre'                 => 'Empresa Uno',
                'email_contacto'         => 'empresa@gmail.com',
                'telefono'               => '3124567899',
                'direccion'              => 'calle 14 # 2-42',
                'documento_representante'=> '1103999991',
                'nombre_representante'   => 'Carlos Rodriguez',
                'telefono_representante' => '3124567800',
                'email_representante'    => 'carlos@gmail.com',
                'id_ciudad'              => 730236,
                'id_estado'              => 5,
                'created_at'             => '2026-03-06 18:22:03',
                'updated_at'             => '2026-03-20 21:05:32',
            ],
        ];

        foreach ($data as $item) {
            DB::table('empresa')->updateOrInsert(['nit' => $item['nit']], $item);
        }
    }
}