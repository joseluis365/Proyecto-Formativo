<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id_rol' => 1,
                'tipo_usu' => 'Super Admin',
                'id_estado' => 1,
            ],
            [
                'id_rol' => 2,
                'tipo_usu' => 'Admin',
                'id_estado' => 1,
            ],
            [
                'id_rol' => 3,
                'tipo_usu' => 'personal Administrativo',
                'id_estado' => 1,
            ],
            [
                'id_rol' => 4,
                'tipo_usu' => 'Medico',
                'id_estado' => 1,
            ],
            [
                'id_rol' => 5,
                'tipo_usu' => 'Paciente',
                'id_estado' => 1,
            ],
            [
                'id_rol' => 6,
                'tipo_usu' => 'Farmaceutico',
                'id_estado' => 1,
            ],
            [
                'id_rol' => 8,
                'tipo_usu' => 'x',
                'id_estado' => 1,
            ],
        ];

        foreach ($data as $item) {
            DB::table('rol')->updateOrInsert(['id_rol' => $item['id_rol']], $item);
        }
    }
}
