<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Constants\RolConstants;

class Empresa extends Model
{
    protected $table = 'empresa';
    protected $primaryKey = 'nit';

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['nit', 
    'nombre', 
    'email_contacto', 
    'telefono', 
    'direccion', 
    'documento_representante', 
    'nombre_representante', 
    'telefono_representante', 
    'email_representante', 
    'id_ciudad', 
    'id_estado'];

    public function licencias()
    {
        return $this->hasMany(EmpresaLicencia::class, 'nit', 'nit');
    }

    // Licencia más reciente (CLAVE)
    public function licenciaActual()
    {
        return $this->hasOne(EmpresaLicencia::class, 'nit', 'nit')
            ->latestOfMany('created_at');
    }

    public function adminUser()
    {
        return $this->hasOne(Usuario::class, 'nit', 'nit')
            ->where('id_rol', RolConstants::ADMIN)
            ->latest(); 
    }

    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class, 'id_ciudad', 'codigo_postal');
    }
}