<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo RecetaDetalle.
 * Detalla medicamentos, dosis y frecuencia de una receta.
 */
class RecetaDetalle extends Model
{
    protected $table = 'receta_detalle';
    protected $primaryKey = 'id_detalle_receta';
    public $timestamps = true;

    protected $fillable = [
        'id_receta',
        'id_presentacion',
        'nit_farmacia',
        'cantidad_dispensar',
        'dosis',
        'frecuencia',
        'duracion',
        'observaciones'
    ];

    public function receta()
    {
        return $this->belongsTo(Receta::class, 'id_receta', 'id_receta');
    }

    public function presentacion()
    {
        return $this->belongsTo(Presentacion::class, 'id_presentacion', 'id_presentacion');
    }

    public function farmacia()
    {
        return $this->belongsTo(Farmacia::class, 'nit_farmacia', 'nit');
    }

    public function dispensacion()
    {
        return $this->hasOne(Dispensacion::class, 'id_detalle_receta', 'id_detalle_receta');
    }
}
