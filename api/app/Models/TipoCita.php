<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoCita extends Model
{
    use HasFactory;

    protected $table = 'tipo_cita';
    protected $primaryKey = 'id_tipo_cita';

    protected $fillable = [
        'tipo',
        'id_estado',
        'acceso_directo',
        'id_especialidad',
    ];

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'id_especialidad', 'id_especialidad');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
