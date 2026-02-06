<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;
use App\Models\EmpresaLicencia;
use App\Models\TipoLicencia;
use App\Models\Estado;
use Illuminate\Support\Str;

class EmpresaLicenciaSeeder extends Seeder
{
    public function run(): void
    {
        $empresa = Empresa::first();
        if (!$empresa) return;

        $tipoLicencia = TipoLicencia::where('tipo', 'Demo')->first();
        $estadoActiva = Estado::where('nombre_estado', 'ACTIVA')->first();

        EmpresaLicencia::create([
            'id_empresa_licencia' => strtoupper(Str::random(10)),
            'nit' => $empresa->nit,
            'id_tipo_licencia' => $tipoLicencia->id_tipo_licencia,
            'fecha_inicio' => now(),
            'fecha_fin' => now()->addMonth(),
            'id_estado' => $estadoActiva->id_estado,
        ]);
    }
}
