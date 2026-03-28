<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EspecialidadSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id_especialidad' => 11,
                'especialidad' => 'Cardiologia',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 3,
                'especialidad' => 'Medicina Interna',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 4,
                'especialidad' => 'Cardiología',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 5,
                'especialidad' => 'Traumatología',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 7,
                'especialidad' => 'Neurología',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 8,
                'especialidad' => 'Neumología',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 9,
                'especialidad' => 'Dermatología',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 10,
                'especialidad' => 'Oftalmología',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 'f',
            ],
            [
                'id_especialidad' => 1,
                'especialidad' => 'Medicina General',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 't',
            ],
            [
                'id_especialidad' => 2,
                'especialidad' => 'Pediatría',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 't',
            ],
            [
                'id_especialidad' => 6,
                'especialidad' => 'Ginecología',
                'id_estado' => 1,
                'created_at' => null,
                'updated_at' => null,
                'acceso_directo' => 't',
            ],
        ];

        foreach ($data as $item) {
            DB::table('especialidad')->updateOrInsert(['id_especialidad' => $item['id_especialidad']], $item);
        }
    }
}
