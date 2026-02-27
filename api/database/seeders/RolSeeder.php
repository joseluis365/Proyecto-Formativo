<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['id_rol' => 1, 'tipo_usu' => 'ADMIN'],
            ['id_rol' => 2, 'tipo_usu' => 'MEDICO'],
            ['id_rol' => 3, 'tipo_usu' => 'PERSONAL_ADMINISTRATIVO'],
            ['id_rol' => 4, 'tipo_usu' => 'PACIENTE'],
            ['id_rol' => 5, 'tipo_usu' => 'FARMACEUTICO'],
        ];

        foreach ($roles as $rol) {
            DB::table('rol')->updateOrInsert(
                ['id_rol' => $rol['id_rol']],
                $rol
            );
        }

        DB::statement("
            SELECT setval(
                pg_get_serial_sequence('rol', 'id_rol'),
                COALESCE((SELECT MAX(id_rol) FROM rol), 1),
                true
            );
        ");
    }
}
