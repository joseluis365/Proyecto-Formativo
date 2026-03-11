<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    protected $table = 'movimiento_inventario';
    protected $primaryKey = 'id_movimiento';
    public $timestamps = true;

    protected $fillable = [
        'id_lote',
        'tipo_movimiento',
        'cantidad',
        'fecha',
        'documento',
        'motivo',
        'id_dispensacion'
    ];

    public function loteMedicamento()
    {
        return $this->belongsTo(LoteMedicamento::class, 'id_lote', 'id_lote');
    }

    public function usuarioDocumento()
    {
        return $this->belongsTo(Usuario::class, 'documento', 'documento');
    }

    public function dispensacion()
    {
        return $this->belongsTo(Dispensacion::class, 'id_dispensacion', 'id_dispensacion');
    }
}
