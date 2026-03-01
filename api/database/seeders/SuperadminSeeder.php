<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Superadmin;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class SuperadminSeeder extends Seeder
{
    public function run(): void
    {
        Superadmin::updateOrCreate(
            ['email' => 'madarazeduchiha@gmail.com'],
            [
                'documento' => 999999999,
                'nombre' => 'Super Admin',
                'usuario' => 'madarazeduchiha',
                'contrasena' => Hash::make('admin123'),
                'id_rol' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}