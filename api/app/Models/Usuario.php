<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; 
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Hash;

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

    /**
     * 🔐 IMPORTANTE:
     * Laravel usa "password" por defecto.
     * Nosotros usamos "contrasena".
     * Debemos indicarle cuál es el campo real.
     */
    public function getAuthPassword()
    {
        return $this->contrasena;
    }

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
        'id_farmacia',
    ];

    protected $hidden = [
        'contrasena',
        'remember_token',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    /**
     * 🔗 RELACIONES
     */

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

    public function farmacia()
    {
        return $this->belongsTo(Farmacia::class, 'id_farmacia', 'nit');
    }

    /**
     * 🔒 Mutator automático para encriptar contraseña
     * Evita que alguien olvide hacer Hash::make()
     */
    public function setContrasenaAttribute($value)
    {
        if (!empty($value)) {
            // Verifica si el valor yá es un hash válido de Laravel para evitar doble hash
            if (Hash::info($value)['algoName'] !== 'unknown' && !Hash::needsRehash($value)) {
                $this->attributes['contrasena'] = $value;
            } else {
                $this->attributes['contrasena'] = Hash::make($value);
            }
        }
    }
}
