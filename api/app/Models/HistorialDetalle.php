<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HistorialDetalle extends Model
{
    use HasFactory;

    protected $table = 'historial_detalle';
    protected $primaryKey = 'id_detalle';
    public $timestamps = true;

    protected $fillable = [
        // Campos originales — no se eliminan
        'id_historial',
        'id_cita',
        'diagnostico',       // SOAP A (Assessment)
        'tratamiento',       // SOAP P (Plan)
        'notas_medicas',
        'observaciones',
        // Campos SOAP nuevos
        'subjetivo',         // SOAP S — anamnesis del paciente
        'signos_vitales',    // SOAP O — signos vitales (JSON)
    ];

    protected $casts = [
        'signos_vitales' => 'array', // PostgreSQL JSONB → PHP array automáticamente
    ];

    // ── Relaciones ────────────────────────────────────────────────────────────

    /**
     * Alias "historial" para compatibilidad con rama david (AtencionMedicaController).
     */
    public function historial()
    {
        return $this->belongsTo(HistorialClinico::class, 'id_historial', 'id_historial');
    }

    /**
     * Alias original mantenido para compatibilidad con el proyecto base.
     */
    public function historialClinico()
    {
        return $this->belongsTo(HistorialClinico::class, 'id_historial', 'id_historial');
    }

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    public function remisiones()
    {
        return $this->hasMany(Remision::class, 'id_detalle_cita', 'id_detalle');
    }

    public function receta()
    {
        return $this->hasOne(Receta::class, 'id_detalle_cita', 'id_detalle');
    }

    /**
     * Enfermedades diagnosticadas (ICD-11) en esta consulta.
     */
    public function enfermedades()
    {
        return $this->belongsToMany(Enfermedad::class, 'historial_enfermedades', 'historial_detalle_id', 'enfermedad_codigo_icd');
    }
}
