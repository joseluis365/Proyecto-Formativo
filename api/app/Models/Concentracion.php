<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Concentracion.
 * Catalogo de concentraciones para presentaciones de medicamentos.
 */
class Concentracion extends Model
{
    protected $table = 'concentracion';
    protected $primaryKey = 'id_concentracion';
    public $timestamps = false;

    protected $fillable = [
        'concentracion'
    ];

    public function presentaciones()
    {
        return $this->hasMany(Presentacion::class, 'id_concentracion', 'id_concentracion');
    }
}
