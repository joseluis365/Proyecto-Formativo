<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialDetalle extends Model
{
    protected $table = 'historial_detalle';
    protected $primaryKey = 'id_detalle';
    public $timestamps = true;

    protected $fillable = [
        'id_historial',
        'id_cita',
        'diagnostico',
        'tratamiento',
        'notas_medicas',
        'observaciones'
    ];

    public function historialClinico()
    {
        return $this->belongsTo(HistorialClinico::class, 'id_historial', 'id_historial');
    }

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }
}
