<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Receta.
 * Encapsula la formula medica creada en una atencion.
 */
class Receta extends Model
{
    protected $table = 'receta';
    protected $primaryKey = 'id_receta';
    public $timestamps = true;

    protected $fillable = [
        'id_detalle_cita',
        'fecha_vencimiento',
        'id_estado'
    ];

    public function historialDetalle()
    {
        return $this->belongsTo(HistorialDetalle::class, 'id_detalle_cita', 'id_detalle');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }

    public function detalles()
    {
        return $this->hasMany(RecetaDetalle::class, 'id_receta', 'id_receta');
    }

    public function recetaDetalles()
    {
        return $this->hasMany(RecetaDetalle::class, 'id_receta', 'id_receta');
    }
}
