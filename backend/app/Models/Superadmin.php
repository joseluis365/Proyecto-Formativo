<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Rol;

class Superadmin extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'superadmin';

    protected $primaryKey = 'documento';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $hidden = ['contrasena'];

    protected $fillable = [
        'documento',
        'nombre',
        'usuario',
        'contrasena',
        'id_rol',
    ];

    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }
}
