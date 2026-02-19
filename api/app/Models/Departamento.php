<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    protected $table = 'departamento';
    protected $primaryKey = 'codigo_DANE';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['codigo_DANE', 'nombre'];
}
