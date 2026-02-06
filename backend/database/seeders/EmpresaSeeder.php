<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaSeeder extends Seeder
{
    public function run()
    {
        DB::table('empresa')->insert([
            'nit' => '900123456',
            'nombre' => 'EPS Proyecto Formativo',
            'email_contacto' => 'contacto@eps.com',
            'telefono' => '3001234567',
            'direccion' => 'Ibagué',
            'id_estado' => 1,
        ]);
    }
}
