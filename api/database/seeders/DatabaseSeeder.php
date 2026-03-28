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
            EstadoSeeder::class,
            RolSeeder::class,
            EspecialidadSeeder::class,
            TipoDocumentoSeeder::class,
            MotivoConsultaSeeder::class,
            CategoriaExamenSeeder::class,
            CategoriaMedicamentoSeeder::class,
            DepartamentoSeeder::class,
            CiudadSeeder::class,
            TipoLicenciaSeeder::class,
            PrioridadSeeder::class,
            TipoCitaSeeder::class,
            ConsultorioSeeder::class,
            EnfermedadesSeeder::class,
            FormaFarmaceuticaSeeder::class,
            ConcentracionSeeder::class,
            MedicamentoSeeder::class,
            PresentacionMedicamentoSeeder::class,
            EmpresaSeeder::class,
            EmpresaLicenciaSeeder::class,
            FarmaciaSeeder::class,
            SuperadminSeeder::class,
            AdminUsuarioSeeder::class,
            FarmaceutaSeeder::class,
            MedicoSeeder::class,
            RecepcionistaSeeder::class,
            PacienteSeeder::class,
            UsuariosPruebaSeeder::class,
        ]);
        
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
