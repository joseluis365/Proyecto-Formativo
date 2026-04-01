<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Pqr.
 * Almacena peticiones, quejas y reclamos de usuarios.
 */
class Pqr extends Model
{
    protected $table = 'pqr';
    protected $primaryKey = 'id_pqr';
    public $timestamps = true;

    protected $fillable = [
        'nombre_usuario',
        'email',
        'telefono',
        'asunto',
        'mensaje',
        'respuesta',
        'id_estado',
        'archivo_adjunto',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
