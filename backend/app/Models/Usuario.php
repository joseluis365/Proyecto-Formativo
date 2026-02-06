<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Empresa;
use App\Models\Rol;
use App\Models\Estado;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'usuario';

    protected $primaryKey = 'documento';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $hidden = [
        'contrasena',
    ];

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

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Laravel usará "contrasena" como password
     */
    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    // Relaciones
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'nit', 'nit');
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado', 'id_estado');
    }
}
