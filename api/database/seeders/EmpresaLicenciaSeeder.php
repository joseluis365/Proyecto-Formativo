<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmpresaLicencia;
use App\Models\Empresa;
use App\Models\Licencia;
use Carbon\Carbon;

class EmpresaLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        $empresa = Empresa::where('nit', '900123456-7')->first();
        $licencia = Licencia::where('tipo', 'BASICA')->first();

        if (!$empresa || !$licencia) return;

        EmpresaLicencia::updateOrCreate(
            [
                'nit' => $empresa->nit
            ],
            [
                'id_empresa_licencia' => 'L_0000000001', 
                'id_tipo_licencia' => $licencia->id_tipo_licencia,
                'fecha_inicio' => Carbon::now(),
                'fecha_fin' => Carbon::now()->addMonths(12),
                'id_estado' => 1
            ]
        );
    }
}