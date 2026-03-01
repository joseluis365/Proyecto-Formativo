<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrioridadSeeder extends Seeder
{
    public function run(): void
    {
        $prioridades = [
            ['id_prioridad' => 1, 'prioridad' => 'Alta', 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id_prioridad' => 2, 'prioridad' => 'Media', 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id_prioridad' => 3, 'prioridad' => 'Baja', 'id_estado' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id_prioridad' => 4, 'prioridad' => 'Urgente', 'id_estado' => 2, 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($prioridades as $prioridad) {
            DB::table('prioridad')->updateOrInsert(
                ['id_prioridad' => $prioridad['id_prioridad']],
                $prioridad
            );
        }

        DB::statement("
            SELECT setval(
                pg_get_serial_sequence('prioridad', 'id_prioridad'),
                COALESCE((SELECT MAX(id_prioridad) FROM prioridad), 1),
                true
            );
        ");
    }
}
