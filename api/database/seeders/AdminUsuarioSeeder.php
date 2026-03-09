<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Constants\RolConstants;

class AdminUsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::updateOrCreate(
            ['documento' => 100000001],
            [
                'primer_nombre' => 'Admin',
                'primer_apellido' => 'Principal',
                'email' => 'madarazeduchiha@gmail.com',
                'telefono' => '3001111111',
                'direccion' => 'Calle Admin',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '1990-01-01',
                'grupo_sanguineo' => 'O+',
                'contrasena' => Hash::make('adsoSENA123$'),
                'registro_profesional' => null,
                'nit' => '900123456-7',
                'id_rol' => RolConstants::ADMIN,
                'id_estado' => 2,
                'id_especialidad' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}