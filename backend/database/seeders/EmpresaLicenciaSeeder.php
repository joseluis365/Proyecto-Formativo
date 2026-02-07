<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmpresaLicencia;
use Carbon\Carbon;

class EmpresaLicenciaSeeder extends Seeder
{
    public function run()
    {
        EmpresaLicencia::updateOrCreate(
            [
                'nit' => '900123456',
            ],
            [
                'id_tipo_licencia' => 1,
                'fecha_inicio' => Carbon::now()->subDays(1),
                'fecha_fin' => Carbon::now()->addMonths(6),
                'id_estado' => 1, // Activo
            ]
        );
    }
}
