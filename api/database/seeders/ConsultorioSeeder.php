<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConsultorioSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 50; $i++) {
            DB::table('consultorio')->updateOrInsert(
                ['id_consultorio' => $i],
                ['id_consultorio' => $i, 'numero_consultorio' => 100 + $i]
            );
        }
    }
}
