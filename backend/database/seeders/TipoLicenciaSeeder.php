<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoLicencia;
use App\Models\Estado;

class TipoLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        $estadoActiva = Estado::where('nombre_estado', 'ACTIVA')->first();

        TipoLicencia::insert([
            [
                'tipo' => 'Demo',
                'descripcion' => 'Licencia de prueba',
                'duracion_meses' => 1,
                'precio' => 0,
                'id_estado' => $estadoActiva->id_estado,
            ],
            [
                'tipo' => 'Mensual',
                'descripcion' => 'Licencia mensual',
                'duracion_meses' => 1,
                'precio' => 50000,
                'id_estado' => $estadoActiva->id_estado,
            ],
            [
                'tipo' => 'Anual',
                'descripcion' => 'Licencia anual',
                'duracion_meses' => 12,
                'precio' => 500000,
                'id_estado' => $estadoActiva->id_estado,
            ],
        ]);
    }
}
