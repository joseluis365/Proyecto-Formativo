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
        $licencia = Licencia::where('nombre', 'Licencia Básica')->first();

        if (!$empresa || !$licencia) return;

        EmpresaLicencia::updateOrCreate(
            [
                'empresa_nit' => $empresa->nit
            ],
            [
                'tipo_licencia_id' => $licencia->id,
                'fecha_inicio' => Carbon::now(),
                'fecha_fin' => Carbon::now()->addMonths(12),
                'estado' => 'Activa'
            ]
        );
    }
}