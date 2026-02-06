<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run()
    {
        DB::table('usuario')->insert([
            'documento' => 1000000000,
            'nombre' => 'Admin',
            'apellido' => 'Sistema',
            'email' => 'admin@eps.com',
            'telefono' => '3000000000',
            'direccion' => 'Ibagué',
            'sexo' => 'Masculino',
            'fecha_nacimiento' => '1995-01-01',
            'grupo_sanguineo' => 'O+',
            'contrasena' => Hash::make('admin123'),
            'id_empresa' => 1,
            'id_rol' => 1,
            'id_estado' => 1,
        ]);
    }
}
