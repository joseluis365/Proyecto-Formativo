<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // === CATÁLOGOS BASE (sin dependencias) ===
            EstadoSeeder::class,
            RolSeeder::class,
            TipoDocumentoSeeder::class,
            TipoLicenciaSeeder::class,
            PrioridadSeeder::class,
            CategoriaExamenSeeder::class,
            CategoriaMedicamentoSeeder::class,
            FormaFarmaceuticaSeeder::class,
            ConcentracionSeeder::class,

            // === GEOGRAFÍA ===
            DepartamentoSeeder::class,
            CiudadSeeder::class,

            // === EMPRESA & LICENCIAS ===
            EmpresaSeeder::class,
            EmpresaLicenciaSeeder::class,

            // === FARMACIA & MEDICAMENTOS ===
            FarmaciaSeeder::class,
            MedicamentoSeeder::class,
            PresentacionMedicamentoSeeder::class,
            LoteMedicamentoSeeder::class,
            InventarioFarmaciaSeeder::class,

            // === CLÍNICA ===
            EspecialidadSeeder::class,
            ConsultorioSeeder::class,
            TipoCitaSeeder::class,
            MotivoConsultaSeeder::class,
            EnfermedadesSeeder::class,

            // === USUARIOS (en orden de dependencias) ===
            SuperadminSeeder::class,
            AdminUsuarioSeeder::class,
            FarmaceutaSeeder::class,
            MedicoSeeder::class,
            RecepcionistaSeeder::class,
            PacienteSeeder::class,
            UsuariosPruebaSeeder::class,
        ]);

        // Sincronizar secuencias de PostgreSQL automáticamente
        $this->command->info('Sincronizando secuencias de PostgreSQL...');
        $this->syncSequences();
        $this->command->info('Secuencias sincronizadas correctamente.');
    }

    /**
     * Sincroniza las secuencias de PostgreSQL con el valor máximo (ID) de cada tabla.
     * Esto evita errores de "Unique violation" al insertar nuevos registros
     * después de haber ejecutado seeders que fuerzan los IDs.
     */
    private function syncSequences(): void
    {
        // Tablas que NO tienen comandos seriales/autoincrementales estándar o
        // deben ignorarse por su naturaleza en este esquema.
        $excludedTables = ['usuario', 'ciudad', 'departamento', 'empresa', 'farmacia'];

        // Solo ejecutar en conexiones PostgreSQL
        if (\Illuminate\Support\Facades\DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        $sequences = \Illuminate\Support\Facades\DB::select("
            SELECT c.relname AS sequencename, t.relname AS tablename
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            JOIN pg_depend d ON d.objid = c.oid
            JOIN pg_class t ON d.refobjid = t.oid
            WHERE c.relkind = 'S' AND n.nspname = 'public'
        ");

        foreach ($sequences as $seq) {
            $seqName = $seq->sequencename;
            $tableName = $seq->tablename;

            if (in_array($tableName, $excludedTables)) {
                continue;
            }

            // Encontrar la columna PK para esta tabla
            $pkResults = \Illuminate\Support\Facades\DB::select("
                SELECT a.attname
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = ?::regclass AND i.indisprimary
            ", [$tableName]);

            if (empty($pkResults)) {
                continue;
            }

            $pk = $pkResults[0]->attname;
            
            // Obtener el ID máximo actual o 0 si está vacía
            $maxId = \Illuminate\Support\Facades\DB::table($tableName)->max($pk) ?: 0;

            // Sincronizar la secuencia
            \Illuminate\Support\Facades\DB::statement("SELECT setval(?, ?, true)", [$seqName, $maxId]);
        }
    }
}
