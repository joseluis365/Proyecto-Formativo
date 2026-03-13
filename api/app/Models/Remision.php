<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Remision extends Model
{
    use HasFactory;

    protected $table = 'remision';
    protected $primaryKey = 'id_remision';

    protected $fillable = [
        'id_detalle_cita',
        'tipo_remision',
        'id_especialidad',
        'id_examen',
        'id_prioridad',
        'notas',
        'id_estado',
    ];

    public function detalleCita()
    {
        return $this->belongsTo(HistorialDetalle::class, 'id_detalle_cita', 'id_detalle');
    }

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'id_especialidad', 'id_especialidad');
    }

    public function examen()
    {
        return $this->belongsTo(Examen::class, 'id_examen', 'id_examen');
    }

    public function prioridad()
    {
        return $this->belongsTo(Prioridad::class, 'id_prioridad', 'id_prioridad');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
