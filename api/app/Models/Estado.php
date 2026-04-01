<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Estado.
 * Catalogo transversal de estados para entidades del dominio.
 */
class Estado extends Model
{
    protected $table = 'estado';
    protected $primaryKey = 'id_estado';

    protected $fillable = [
        'id_estado',
        'nombre_estado',
    ];

    public $timestamps = false;
}
