<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dispensacion extends Model
{
    protected $table = 'dispensacion_farmacia';
    protected $primaryKey = 'id_dispensacion';
    public $timestamps = true; // Use default timestamps since created_at and updated_at exist

    protected $fillable = [
        'id_detalle_receta',
        'nit_farmacia',
        'cantidad',
        'fecha_dispensacion',
        'documento_farmaceutico',
        'id_estado'
    ];

    public function detalleReceta()
    {
        return $this->belongsTo(RecetaDetalle::class, 'id_detalle_receta', 'id_detalle_receta');
    }

    public function farmacia()
    {
        return $this->belongsTo(Farmacia::class, 'nit_farmacia', 'nit');
    }

    public function farmaceutico()
    {
        return $this->belongsTo(Usuario::class, 'documento_farmaceutico', 'documento');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
