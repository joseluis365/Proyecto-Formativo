<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
