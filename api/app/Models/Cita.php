<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $table = 'cita';

    protected $primaryKey = 'id_cita';
    protected $fillable = [
        'doc_paciente',
        'doc_medico',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'motivo',
        'tipo_cita_id',
        'id_estado',
    ];

    public function paciente()
    {
        return $this->belongsTo(Usuario::class, 'doc_paciente', 'documento');
    }

    public function medico()
    {
        return $this->belongsTo(Usuario::class, 'doc_medico', 'documento');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }

    public function tipoCita()
    {
        return $this->belongsTo(TipoCita::class, 'tipo_cita_id', 'id_tipo_cita');
    }
    public function historialDetalle()
    {
        return $this->hasOne(HistorialDetalle::class, 'id_cita', 'id_cita');
    }
}
