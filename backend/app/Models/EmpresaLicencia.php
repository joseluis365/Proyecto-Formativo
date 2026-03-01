<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaLicencia extends Model
{
    protected $table = 'empresa_licencia';

    protected $primaryKey = 'id_empresa_licencia';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id_empresa_licencia',
        'nit',
        'id_tipo_licencia',
        'fecha_inicio',
        'fecha_fin',
        'id_estado',
    ];
}
