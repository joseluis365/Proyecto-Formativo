<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Usuario;
use App\Models\Empresa;
use App\Models\EmpresaLicencia;
use App\Models\TipoLicencia;

class Estado extends Model
{
    use HasFactory;

    protected $table = 'estado';
    protected $primaryKey = 'id_estado';
    public $timestamps = false;

    protected $fillable = [
        'nombre_estado',
        'descripcion',
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_estado', 'id_estado');
    }

    public function empresas()
    {
        return $this->hasMany(Empresa::class, 'id_estado', 'id_estado');
    }

    public function licenciasEmpresa()
    {
        return $this->hasMany(EmpresaLicencia::class, 'id_estado', 'id_estado');
    }

    public function tiposLicencia()
    {
        return $this->hasMany(TipoLicencia::class, 'id_estado', 'id_estado');
    }
}
