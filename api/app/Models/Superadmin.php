<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Superadmin extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'superadmin';
    protected $primaryKey = 'documento';
    public $incrementing = false;
    protected $keyType = 'integer';

    protected $fillable = [
        'documento',
        'nombre',
        'usuario',
        'email',
        'contrasena',
        'id_rol',
    ];

    protected $hidden = [
        'contrasena',
    ];

    // Specify the password field for authentication
    public function getAuthPassword()
    {
        return $this->contrasena;
    }
}
