<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departamento;
use Carbon\Carbon;

class DepartamentoSeeder extends Seeder
{
    public function run(): void
    {
        Departamento::updateOrCreate(
            ['codigo_DANE' => 11],
            [
                'nombre' => 'Bogotá',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}