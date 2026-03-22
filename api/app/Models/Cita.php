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
        'id_estado',
        'recordatorio_enviado',
        'tipo_evento',
        'id_especialidad',
        'id_motivo',
    ];

    protected $casts = [
        'recordatorio_enviado' => 'boolean',
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

    public function historialDetalle()
    {
        return $this->hasOne(HistorialDetalle::class, 'id_cita', 'id_cita');
    }

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'id_especialidad', 'id_especialidad');
    }

    public function motivoConsulta()
    {
        return $this->belongsTo(MotivoConsulta::class, 'id_motivo', 'id_motivo');
    }
}
