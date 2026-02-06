<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuario';

    protected $primaryKey = 'documento';
    public $incrementing = false;
    protected $keyType = 'string'; // 🔑 recomendado

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
        'nit',
        'id_rol',
        'id_estado',
    ];

    protected $hidden = [
        'contrasena',
    ];

    /**
     * 🔐 Le dice a Laravel qué campo usar como password
     */
    public function getAuthPassword()
    {
        return $this->contrasena;
    }
}
