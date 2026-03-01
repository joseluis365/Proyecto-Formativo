<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaExamen extends Model
{
    use HasFactory;

    protected $table = 'categoria_examen';
    protected $primaryKey = 'id_categoria_examen';

    protected $fillable = [
        'categoria',
        'id_estado',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
