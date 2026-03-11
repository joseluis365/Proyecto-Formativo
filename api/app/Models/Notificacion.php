<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $table = 'notificacion';
    protected $primaryKey = 'id_notificacion';

    protected $fillable = [
        'doc_usuario',
        'id_cita',
        'titulo',
        'mensaje',
        'tipo',
        'leida',
    ];

    protected $casts = [
        'leida' => 'boolean',
    ];

    /**
     * Usuario destinatario de la notificación.
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'doc_usuario', 'documento');
    }

    /**
     * Cita relacionada (opcional).
     */
    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }
}
