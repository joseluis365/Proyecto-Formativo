<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Licencia; // tu modelo se llama Licencia
use Carbon\Carbon;

class TipoLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        Licencia::updateOrCreate(
            ['tipo' => 'BASICA'],
            [
                'descripcion' => 'Licencia anual básica para empresas',
                'duracion_meses' => 12,
                'precio' => 500000,
                'id_estado' => 1, // Activo
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );

        Licencia::updateOrCreate(
            ['tipo' => 'PREMIUM'],
            [
                'descripcion' => 'Licencia premium con todos los módulos habilitados',
                'duracion_meses' => 12,
                'precio' => 1200000,
                'id_estado' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}