<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Examen extends Model
{
    protected $table = 'examen';
    protected $primaryKey = 'id_examen';
    public $timestamps = true;

    protected $fillable = [
        'nombre',
        'id_categoria_examen',
        'requiere_ayuno',
        'descripcion',
        'doc_paciente',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'id_estado',
        'resultado_pdf',
    ];

    public function categoriaExamen()
    {
        return $this->belongsTo(CategoriaExamen::class, 'id_categoria_examen', 'id_categoria_examen');
    }

    public function paciente()
    {
        return $this->belongsTo(Usuario::class, 'doc_paciente', 'documento');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
