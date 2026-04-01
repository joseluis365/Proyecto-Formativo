<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo Licencia.
 * Define tipos/estados de licencia y su vigencia operativa.
 */
class Licencia extends Model
{
    protected $table = 'tipo_licencia';
    protected $primaryKey = 'id_tipo_licencia';
    protected $fillable = [
        'tipo',             
        'descripcion', 
        'precio', 
        'duracion_meses', 
        'id_estado'];

        public function empresaLicencias()
{
    return $this->hasMany(EmpresaLicencia::class, 'id_tipo_licencia', 'id_tipo_licencia');
}
}
