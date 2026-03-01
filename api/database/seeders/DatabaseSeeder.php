<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LicensingSeeder::class,
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
        
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
