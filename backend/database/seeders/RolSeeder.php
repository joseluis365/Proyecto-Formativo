<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rol;

class RolSeeder extends Seeder
{
    public function run(): void
    {
        Rol::insert([
            ['tipo_usu' => 'ADMIN'],
            ['tipo_usu' => 'MEDICO'],
            ['tipo_usu' => 'PACIENTE'],
        ]);
    }
}
