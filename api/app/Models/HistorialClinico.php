<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialClinico extends Model
{
    protected $table = 'historial_clinico';
    protected $primaryKey = 'id_historial';
    public $timestamps = true;

    protected $fillable = [
        'id_paciente',
        'antecedentes_personales',
        'antecedentes_familiares',
        'alergias',
        'habitos_vida',
    ];

    protected $casts = [
        'habitos_vida' => 'array',
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
