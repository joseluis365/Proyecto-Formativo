<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolSeeder extends Seeder
{
    public function run()
    {
        DB::table('rol')->insert([
            ['tipo_usu' => 'Administrador'],
            ['tipo_usu' => 'Médico'],
            ['tipo_usu' => 'Paciente'],
        ]);
    }
}
