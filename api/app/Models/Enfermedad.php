<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Enfermedad.
 * Catalogo diagnostico (incluye codigos ICD).
 */
class Enfermedad extends Model
{
    protected $table = 'enfermedades';

    protected $primaryKey = 'codigo_icd';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'codigo_icd',
        'nombre',
        'descripcion'
    ];
}
