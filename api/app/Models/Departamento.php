<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    protected $table = 'departamento';
    protected $primaryKey = 'codigo_DANE';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = ['codigo_DANE', 'nombre', 'id_estado'];

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
