<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remision extends Model
{
    protected $table = 'remision';
    protected $primaryKey = 'id_remision';
    public $timestamps = true;

    protected $fillable = [
        'id_detalle_cita',
        'id_cita',
        'tipo_remision',
        'id_especialidad',
        'id_categoria_examen',
        'id_examen',
        'id_prioridad',
        'requiere_ayuno',
        'notas',
        'id_estado',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    public function historialDetalle()
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

    public function categoriaExamen()
    {
        return $this->belongsTo(CategoriaExamen::class, 'id_categoria_examen', 'id_categoria_examen');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
