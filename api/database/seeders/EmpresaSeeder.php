<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;
use Carbon\Carbon;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        Empresa::updateOrCreate(
            ['nit' => '900123456-7'],
            [
                'nombre' => 'EPS DEMO SAS',
                'email_contacto' => 'contacto@epsdemo.com',
                'telefono' => '3001234567',
                'direccion' => 'Calle 123 #45-67',
                'documento_representante' => 123456789,
                'nombre_representante' => 'Carlos Perez',
                'telefono_representante' => '3007654321',
                'email_representante' => 'representante@epsdemo.com',
                'id_ciudad' => 11001, // ⚠️ Debe existir en tabla ciudad
                'id_estado' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}