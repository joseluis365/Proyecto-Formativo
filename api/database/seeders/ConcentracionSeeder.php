<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConcentracionSeeder extends Seeder
{
    public function run(): void
    {
        $concentraciones = [
            '500 mg',
            '250 mg',
            '1 g',
            '50 ml',
            '10 mg',
            '5 mg',
            '20 mg',
            '100 mg',
            '150 mg',
            '2%',
            '5%',
            '10%',
            '250 mg/5 ml',
            '100 mcg',
            '500 mcg',
            '850 mg',
            '50 mg',
            '400 mg',
            '800 mg',
            '200 mg',
            '10 ml',
            '15 ml',
            '1%',
            '0.5%',
        ];

        foreach ($concentraciones as $index => $concentracion) {
            DB::table('concentracion')->updateOrInsert(
                ['id_concentracion' => $index + 1],
                [
                    'concentracion' => $concentracion,
                ]
            );
        }
    }
}
