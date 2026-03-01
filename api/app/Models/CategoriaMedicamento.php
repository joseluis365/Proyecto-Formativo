<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaMedicamento extends Model
{
    use HasFactory;

    protected $table = 'categoria_medicamento';
    protected $primaryKey = 'id_categoria';

    protected $fillable = [
        'categoria',
        'id_estado',
    ];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
