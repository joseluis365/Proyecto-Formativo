<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{
    protected $table = 'ciudad';
    protected $primaryKey = 'codigo_postal';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = ['codigo_postal', 'nombre', 'id_departamento', 'id_estado'];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_departamento', 'codigo_DANE');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
