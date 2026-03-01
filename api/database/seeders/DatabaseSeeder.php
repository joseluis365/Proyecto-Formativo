<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            EstadoSeeder::class,
            RolSeeder::class,
            EspecialidadSeeder::class,
            DepartamentoSeeder::class,
            CiudadSeeder::class,
            TipoLicenciaSeeder::class,
            EmpresaSeeder::class,
            EmpresaLicenciaSeeder::class,
            AdminUsuarioSeeder::class,
            SuperadminSeeder::class,
        ]);
    }
}