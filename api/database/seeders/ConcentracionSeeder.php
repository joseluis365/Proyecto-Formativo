<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConcentracionSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id_concentracion' => 1, 'concentracion' => '500mg'],
            ['id_concentracion' => 2, 'concentracion' => '10g'],
        ];

        foreach ($data as $item) {
            DB::table('concentracion')->updateOrInsert(['id_concentracion' => $item['id_concentracion']], $item);
        }
    }
}
