<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Medicamento.
 * Catalogo principal de medicamentos.
 */
class Medicamento extends Model
{
    protected $table = 'medicamento';
    protected $primaryKey = 'id_medicamento';
    public $timestamps = true;

    protected $fillable = [
        'nombre',
        'descripcion',
        'id_categoria',
        'id_estado'
    ];

    public function categoriaMedicamento()
    {
        return $this->belongsTo(CategoriaMedicamento::class, 'id_categoria', 'id_categoria');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }

    public function presentaciones()
    {
        return $this->hasMany(Presentacion::class, 'id_medicamento', 'id_medicamento');
    }
}
