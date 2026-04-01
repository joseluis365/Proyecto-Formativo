<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo CategoriaExamen.
 * Clasificacion de examenes clinicos por categoria.
 */
class CategoriaExamen extends Model
{
    use HasFactory;

    protected $table = 'categoria_examen';
    protected $primaryKey = 'id_categoria_examen';

    protected $fillable = [
        'categoria',
        'id_estado',
        'requiere_ayuno',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
