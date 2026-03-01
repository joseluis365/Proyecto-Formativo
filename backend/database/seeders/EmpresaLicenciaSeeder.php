<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmpresaLicencia;
use Carbon\Carbon;

class EmpresaLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        EmpresaLicencia::create([
            'id_empresa_licencia' => 'LIC-000001',
            'nit' => '900123456',
            'id_tipo_licencia' => 1,
            'fecha_inicio' => Carbon::now()->toDateString(),
            'fecha_fin' => Carbon::now()->addMonths(6)->toDateString(),
            'id_estado' => 1,
        ]);
    }
}
