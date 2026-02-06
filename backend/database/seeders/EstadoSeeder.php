<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoSeeder extends Seeder
{
    public function run()
    {
        DB::table('estado')->insert([
            [
                'nombre_estado' => 'Activo',
                'descripcion' => 'Registro activo',
            ],
            [
                'nombre_estado' => 'Inactivo',
                'descripcion' => 'Registro inactivo',
            ],
        ]);
    }
}
