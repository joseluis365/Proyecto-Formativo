<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// 👇 IMPORTS CORRECTOS (SOLO ARRIBA)
use App\Models\Rol;
use App\Models\Estado;
use App\Models\Empresa;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'documento';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'documento',
        'nombre',
        'apellido',
        'email',
        'telefono',
        'direccion',
        'sexo',
        'fecha_nacimiento',
        'grupo_sanguineo',
        'contrasena',
        'nit',
        'id_rol',
        'id_estado',
    ];

    protected $hidden = [
        'contrasena',
    ];

    // 👇 RELACIONES (NO traits)
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'nit', 'nit');
    }
}
