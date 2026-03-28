<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConsultorioSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'id_consultorio' => 1,
                'numero_consultorio' => 101,
            ],
            [
                'id_consultorio' => 2,
                'numero_consultorio' => 102,
            ],
            [
                'id_consultorio' => 3,
                'numero_consultorio' => 103,
            ],
            [
                'id_consultorio' => 4,
                'numero_consultorio' => 104,
            ],
            [
                'id_consultorio' => 5,
                'numero_consultorio' => 105,
            ],
        ];

        foreach ($data as $item) {
            DB::table('consultorio')->updateOrInsert(['id_consultorio' => $item['id_consultorio']], $item);
        }
    }
}
