<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 👇 Tabla real
    protected $table = 'usuario';

    // 👇 Clave primaria real
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
        'registro_profesional',
        'id_empresa',
        'id_rol',
        'id_estado',
    ];

    protected $hidden = [
        'contrasena',
    ];
}
