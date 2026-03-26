<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}