<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HistorialClinico extends Model
{
    use HasFactory;

    protected $table = 'historial_clinico';
    protected $primaryKey = 'id_historial';

    protected $fillable = [
        'id_paciente',
        'antecedentes_personales',
        'antecedentes_familiares',
    ];

    public function paciente()
    {
        return $this->belongsTo(Usuario::class, 'id_paciente', 'documento');
    }

    public function detalles()
    {
        return $this->hasMany(HistorialDetalle::class, 'id_historial', 'id_historial');
    }
}
