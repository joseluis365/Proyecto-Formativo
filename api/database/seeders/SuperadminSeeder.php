<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Superadmin;

class SuperadminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Superadmin::count() === 0) {
            Superadmin::create([
                'documento' => '123456789',
                'nombre' => 'Super Admin',
                'usuario' => 'admin',
                'email' => 'joseluis1409rodriguez@gmail.com',
                'contrasena' => Hash::make('password123'), 
                'id_rol' => 1,
            ]);
            
            $this->command->info('Superadmin creado exitosamente.');
        } else {
            $this->command->info('Ya existen superadmins en la base de datos.');
        }
    }
}
