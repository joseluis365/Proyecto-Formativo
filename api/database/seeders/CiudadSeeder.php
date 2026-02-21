<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ciudad;
use Carbon\Carbon;

class CiudadSeeder extends Seeder
{
    public function run(): void
    {
        Ciudad::updateOrCreate(
            ['codigo_postal' => 11001],
            [
                'nombre' => 'Bogotá',
                'id_departamento' => 11,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}