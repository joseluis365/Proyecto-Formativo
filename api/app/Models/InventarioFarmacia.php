<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo InventarioFarmacia.
 * Representa existencias actuales por farmacia y producto.
 */
class InventarioFarmacia extends Model
{
    protected $table = 'inventario_farmacia';
    protected $primaryKey = 'id_inventario';
    public $timestamps = true;

    protected $fillable = [
        'nit_farmacia',
        'id_presentacion',
        'stock_actual'
    ];

    public function farmacia()
    {
        return $this->belongsTo(Farmacia::class, 'nit_farmacia', 'nit');
    }

    public function presentacion()
    {
        return $this->belongsTo(Presentacion::class, 'id_presentacion', 'id_presentacion');
    }
}
