<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoSeeder extends Seeder
{
    public function run(): void
    {
        $estados = [
            ['id_estado' => 1, 'nombre_estado' => 'Activa'],
            ['id_estado' => 2, 'nombre_estado' => 'Inactiva'],
            ['id_estado' => 4, 'nombre_estado' => 'Expira pronto'],
            ['id_estado' => 5, 'nombre_estado' => 'Expirada'],
            ['id_estado' => 6, 'nombre_estado' => 'Pendiente'],
        ];

        foreach ($estados as $estado) {
            DB::table('estado')->updateOrInsert(
                ['id_estado' => $estado['id_estado']],
                $estado
            );
        }
    }
}