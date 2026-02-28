<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class LicensingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // 1. Roles
        DB::table('rol')->insertOrIgnore([
            ['id_rol' => 1, 'tipo_usu' => 'Super Admin'],
            ['id_rol' => 2, 'tipo_usu' => 'Admin'],
            ['id_rol' => 3, 'tipo_usu' => 'personal Administrativo'],
            ['id_rol' => 4, 'tipo_usu' => 'Medico'],
            ['id_rol' => 5, 'tipo_usu' => 'Paciente'],
            ['id_rol' => 6, 'tipo_usu' => 'Farmaceutico'],
        ]);

        // 2. Estados
        DB::table('estado')->insertOrIgnore([
            ['id_estado' => 1, 'nombre_estado' => 'Activo'],
            ['id_estado' => 2, 'nombre_estado' => 'Inactivo'],
            ['id_estado' => 3, 'nombre_estado' => 'Sin Licencia'],
            ['id_estado' => 4, 'nombre_estado' => 'Expira Pronto'],
            ['id_estado' => 5, 'nombre_estado' => 'Licencia Expirada'],
            ['id_estado' => 6, 'nombre_estado' => 'Licencia Bloqueada'],
        ]);

        // 3. Departamentos
        DB::table('departamento')->insertOrIgnore([
            ['codigo_DANE' => 73, 'nombre' => 'Tolima', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // 4. Ciudades
        DB::table('ciudad')->insertOrIgnore([
            ['codigo_postal' => 730001, 'nombre' => 'Ibagué', 'id_departamento' => 73, 'created_at' => $now, 'updated_at' => $now],
            ['codigo_postal' => 730024, 'nombre' => 'Alpujarra', 'id_departamento' => 73, 'created_at' => $now, 'updated_at' => $now],
            ['codigo_postal' => 730026, 'nombre' => 'Alvarado', 'id_departamento' => 73, 'created_at' => $now, 'updated_at' => $now],
            ['codigo_postal' => 730030, 'nombre' => 'Ambalema', 'id_departamento' => 73, 'created_at' => $now, 'updated_at' => $now],
            ['codigo_postal' => 730043, 'nombre' => 'Anzoátegui', 'id_departamento' => 73, 'created_at' => $now, 'updated_at' => $now],
            // More cities can be added from backup.sql if needed, truncating here for brevity
        ]);

        // 5. Especialidades
        DB::table('especialidad')->insertOrIgnore([
            ['id_especialidad' => 1, 'especialidad' => 'Medicina General'],
            ['id_especialidad' => 2, 'especialidad' => 'Pediatría'],
            ['id_especialidad' => 3, 'especialidad' => 'Medicina Interna'],
            ['id_especialidad' => 4, 'especialidad' => 'Cardiología'],
            ['id_especialidad' => 5, 'especialidad' => 'Traumatología'],
            ['id_especialidad' => 6, 'especialidad' => 'Ginecología'],
            ['id_especialidad' => 7, 'especialidad' => 'Neurología'],
            ['id_especialidad' => 8, 'especialidad' => 'Neumología'],
            ['id_especialidad' => 9, 'especialidad' => 'Dermatología'],
            ['id_especialidad' => 10, 'especialidad' => 'Oftalmología'],
        ]);

        // 6. Default Super Admin
        DB::table('superadmin')->insertOrIgnore([
            [
                'documento' => 123456789,
                'nombre' => 'Super Admin',
                'usuario' => 'admin',
                'email' => 'joseluis1409rodriguez@gmail.com',
                'contrasena' => Hash::make('password123'), // Replacing with a hash since reading from SQL directly won't work easily
                'id_rol' => 1,
                'created_at' => clone $now,
                'updated_at' => clone $now,
            ]
        ]);
    }
}
