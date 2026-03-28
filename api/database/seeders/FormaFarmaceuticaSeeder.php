<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormaFarmaceuticaSeeder extends Seeder
{
    public function run(): void
    {
        $formas = [
            'Tableta',
            'Cápsula',
            'Jarabe',
            'Ampolla',
            'Suspensión',
            'Crema',
            'Ungüento',
            'Supositorio',
            'Inhalador',
            'Gotas',
            'Solución inyectable',
            'Polvo para suspensión',
            'Gel',
            'Loción',
            'Óvulos',
        ];

        foreach ($formas as $index => $forma) {
            DB::table('forma_farmaceutica')->updateOrInsert(
                ['id_forma' => $index + 1],
                [
                    'forma_farmaceutica' => $forma,
                ]
            );
        }
    }
}
