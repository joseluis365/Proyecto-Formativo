<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo HistorialReporte.
 * Registra historico de generacion y consulta de reportes.
 */
class HistorialReporte extends Model
{
    protected $table = 'historial_reportes';

    protected $fillable = [
        'id_usuario',
        'tabla_relacion',
        'num_registros',
        'ejemplo_registro'
    ];

    protected $casts = [
        'ejemplo_registro' => 'array'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'documento');
    }
}
