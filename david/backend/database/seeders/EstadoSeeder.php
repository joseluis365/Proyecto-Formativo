<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Estado;

class EstadoSeeder extends Seeder
{
    public function run(): void
    {
        Estado::insert([
            ['nombre_estado' => 'ACTIVA', 'descripcion' => 'Estado activo'],
            ['nombre_estado' => 'INACTIVA', 'descripcion' => 'Estado inactivo'],
            ['nombre_estado' => 'EXPIRADA', 'descripcion' => 'Licencia expirada'],
        ]);
    }
}
