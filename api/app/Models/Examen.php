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
        'descripcion'
    ];

    public function categoriaExamen()
    {
        return $this->belongsTo(CategoriaExamen::class, 'id_categoria_examen', 'id_categoria_examen');
    }
}
