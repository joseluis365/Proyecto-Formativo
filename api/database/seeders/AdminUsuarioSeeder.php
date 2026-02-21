<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminUsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::updateOrCreate(
            ['documento' => 100000001],
            [
                'nombre' => 'Admin',
                'apellido' => 'Principal',
                'email' => 'admin@epsdemo.com',
                'telefono' => '3001111111',
                'direccion' => 'Calle Admin',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '1990-01-01',
                'grupo_sanguineo' => 'O+',
                'contrasena' => Hash::make('12345678'),
                'registro_profesional' => null,
                'nit' => '900123456-7',
                'id_rol' => 1,
                'id_estado' => 1,
                'id_especialidad' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}