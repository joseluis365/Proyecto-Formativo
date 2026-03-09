<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Examen extends Model
{
    use HasFactory;

    protected $table = 'examen';
    protected $primaryKey = 'id_examen';

    protected $fillable = [
        'nombre',
        'id_categoria_examen',
        'requiere_ayuno',
        'descripcion',
    ];

    public function categoria()
    {
        return $this->belongsTo(CategoriaExamen::class, 'id_categoria_examen', 'id_categoria_examen');
    }
}
