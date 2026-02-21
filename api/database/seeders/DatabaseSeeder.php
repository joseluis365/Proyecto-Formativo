<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolSeeder::class,              // 👈 PRIMERO
            EstadoSeeder::class,
            EspecialidadSeeder::class,
            DepartamentoSeeder::class,
            CiudadSeeder::class,
            TipoLicenciaSeeder::class,
            EmpresaSeeder::class,
            AdminUsuarioSeeder::class,
            SuperadminSeeder::class,       // 👈 SIEMPRE AL FINAL
        ]);
    }
}