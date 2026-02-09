<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Superadmin extends Model
{
    protected $table = 'superadmin';
    protected $primaryKey = 'documento';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'documento',
        'nombre',
        'usuario',
        'email',
        'contrasena',
        'id_rol'
    ];
}
