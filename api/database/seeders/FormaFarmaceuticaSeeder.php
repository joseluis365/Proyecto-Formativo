<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormaFarmaceuticaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_forma' => 1, 'forma_farmaceutica' => 'Pastillas'],
            ['id_forma' => 2, 'forma_farmaceutica' => 'Crema'],
            ['id_forma' => 3, 'forma_farmaceutica' => 'Jarabe'],
        ];

        foreach ($data as $item) {
            DB::table('forma_farmaceutica')->updateOrInsert(['id_forma' => $item['id_forma']], $item);
        }
    }
}
