<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HistorialDetalle extends Model
{
    use HasFactory;

    protected $table = 'historial_detalle';
    protected $primaryKey = 'id_detalle';

    protected $fillable = [
        'id_historial',
        'id_cita',
        'diagnostico',
        'tratamiento',
        'notas_medicas',
        'observaciones',
    ];

    public function historial()
    {
        return $this->belongsTo(HistorialClinico::class, 'id_historial', 'id_historial');
    }

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    public function remisiones()
    {
        return $this->hasMany(Remision::class, 'id_detalle_cita', 'id_detalle');
    }
}
