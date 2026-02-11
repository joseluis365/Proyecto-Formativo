<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $table = 'estado';
    protected $primaryKey = 'id_estado';

    protected $fillable = [
        'id_estado',
        'nombre_estado',
    ];
}