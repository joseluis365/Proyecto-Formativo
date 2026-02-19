<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoSeeder extends Seeder
{
    public function run(): void
    {
        $estados = [
            ['id_estado' => 1, 'nombre_estado' => 'Activo'],
            ['id_estado' => 2, 'nombre_estado' => 'Inactivo'],
        ];

        foreach ($estados as $estado) {
            DB::table('estado')->updateOrInsert(
                ['id_estado' => $estado['id_estado']],
                $estado
            );
        }
    }
}
