<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperadminSeeder extends Seeder
{
    public function run(): void
    {
        // Exact data from final.sql (documento=123456789, usuario=admin, email=joseluis1409rodriguez@gmail.com)
        $data = [
            [
                'documento'  => 123456789,
                'nombre'     => 'Super Admin',
                'usuario'    => 'admin',
                'email'      => 'joseluis1409rodriguez@gmail.com',
                'contrasena' => Hash::make('Qwerty123.'),
                'id_rol'     => 1,
                'created_at' => '2026-02-11 21:11:20',
                'updated_at' => '2026-03-06 17:53:29',
            ],
            [
                'documento'  => 11000111,
                'nombre'     => 'Cesar',
                'usuario'    => 'Superadmin Cesar',
                'email'      => 'esquivel7809@gmail.com',
                'contrasena' => Hash::make('Qwerty22026%&2'),
                'id_rol'     => 1,
                'created_at' => '2026-02-11 21:11:20',
                'updated_at' => '2026-03-06 17:53:29',
            ]
        ];

        foreach ($data as $item) {
            DB::table('superadmin')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}