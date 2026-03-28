<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperadminSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'documento' => 123456789,
                'nombre' => 'Carlos Superadmin',
                'usuario' => 'superadmin',
                'email' => 'superadmin@eps.com',
                'contrasena' => Hash::make('Qwerty123.'),
                'id_rol' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($data as $item) {
            DB::table('superadmin')->updateOrInsert(['documento' => $item['documento']], $item);
        }
    }
}