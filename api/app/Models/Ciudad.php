<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{
    protected $table = 'ciudad';
    protected $primaryKey = 'codigo_postal';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['codigo_postal', 'nombre', 'id_departamento'];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_departamento', 'codigo_DANE');
    }
}
