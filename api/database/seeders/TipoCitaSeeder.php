<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoCita;
use App\Models\Estado;

class TipoCitaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estadoActivo = Estado::where('nombre_estado', 'Activo')->first();

        $tipos = [
            'Medicina General',
            'Odontología',
            'Pediatría',
            'Ginecología',
            'Cardiología',
            'Dermatología',
            'Oftalmología',
            'Nutrición y Dietética',
            'Psicología',
            'Fisioterapia'
        ];

        foreach ($tipos as $tipo) {
            TipoCita::firstOrCreate(
                ['tipo' => $tipo],
                ['id_estado' => $estadoActivo ? $estadoActivo->id_estado : 1]
            );
        }
    }
}
