<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['documento' => 1000000000],
            [
                'nombre' => 'Admin',
                'apellido' => 'Sistema',
                'email' => 'admin@eps.com',
                'telefono' => '3000000000',
                'direccion' => 'Ibagué',
                'sexo' => 'Masculino',
                'fecha_nacimiento' => '1995-01-01',
                'grupo_sanguineo' => 'O+',
                'contrasena' => Hash::make('admin123'),
                'id_empresa' => 1, // o null si aún no aplica
                'id_rol' => 1,
                'id_estado' => 1,
            ]
        );
    }
}
