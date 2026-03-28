<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id_estado' => 1,
                'nombre_estado' => 'Activo',
            ],
            [
                'id_estado' => 2,
                'nombre_estado' => 'Inactivo',
            ],
            [
                'id_estado' => 3,
                'nombre_estado' => 'Sin Licencia',
            ],
            [
                'id_estado' => 4,
                'nombre_estado' => 'Expira Pronto',
            ],
            [
                'id_estado' => 5,
                'nombre_estado' => 'Licencia Expirada',
            ],
            [
                'id_estado' => 6,
                'nombre_estado' => 'Licencia Bloqueada',
            ],
            [
                'id_estado' => 9,
                'nombre_estado' => 'Agendada',
            ],
            [
                'id_estado' => 10,
                'nombre_estado' => 'Atendida',
            ],
            [
                'id_estado' => 11,
                'nombre_estado' => 'Cancelada',
            ],
            [
                'id_estado' => 12,
                'nombre_estado' => 'Activa',
            ],
            [
                'id_estado' => 13,
                'nombre_estado' => 'Pendiente',
            ],
            [
                'id_estado' => 14,
                'nombre_estado' => 'Parcialmente Entregada',
            ],
            [
                'id_estado' => 15,
                'nombre_estado' => 'Entregada',
            ],
            [
                'id_estado' => 16,
                'nombre_estado' => 'Inasistencia',
            ],
            [
                'id_estado' => 17,
                'nombre_estado' => 'wad',
            ],
        ];

        foreach ($data as $item) {
            DB::table('estado')->updateOrInsert(['id_estado' => $item['id_estado']], $item);
        }
    }
}
