<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $table = 'citas';
    protected $fillable = [
        'fecha',
        'hora',
        'paciente_id',
        'medico_id',
        'estado',
    ];
}
