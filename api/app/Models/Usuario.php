<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; 
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

// 👇 IMPORTS CORRECTOS (SOLO ARRIBA)
use App\Models\Rol;
use App\Models\Estado;
use App\Models\Empresa;
use App\Models\Especialidad;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'documento';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'documento',
        'primer_nombre',
        'segundo_nombre',
        'primer_apellido',
        'segundo_apellido',
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
        'registro_profesional',
        'id_especialidad',
    ];

    protected $hidden = [
        'contrasena',
    ];

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

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'id_especialidad', 'id_especialidad');
    }
}
