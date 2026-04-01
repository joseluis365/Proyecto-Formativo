<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo FormaFarmaceutica.
 * Catalogo de formas farmaceuticas de presentacion.
 */
class FormaFarmaceutica extends Model
{
    protected $table = 'forma_farmaceutica';
    protected $primaryKey = 'id_forma';
    public $timestamps = false;

    protected $fillable = [
        'forma_farmaceutica'
    ];

    public function presentaciones()
    {
        return $this->hasMany(Presentacion::class, 'id_forma_farmaceutica', 'id_forma');
    }
}
