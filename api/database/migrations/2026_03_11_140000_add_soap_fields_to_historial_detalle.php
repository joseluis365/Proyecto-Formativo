<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Refactorización segura del flujo clínico — sin romper nada existente.
     *
     * Cambios:
     *  1. Agrega campos SOAP (subjetivo, signos_vitales) — todos nullable.
     *  2. Agrega restricción UNIQUE en id_cita para garantizar idempotencia a nivel BD.
     *
     * Compatibilidad:
     *  - Todos los campos nuevos son nullable → migra sin afectar filas existentes.
     *  - La constraint unique(id_cita) es segura si no hay duplicados previos.
     *    En fresh --seed no hay datos previos → siempre segura.
     *  - No elimina columnas existentes.
     */
    public function up(): void
    {
        Schema::table('historial_detalle', function (Blueprint $table) {

            // ── SOAP S: Anamnesis / Motivo ampliado del paciente ───────────────
            $table->text('subjetivo')
                  ->nullable()
                  ->after('observaciones')
                  ->comment('SOAP S — Síntomas y motivo de consulta narrado por el paciente');

            // ── SOAP O: Signos vitales en JSONB ────────────────────────────────
            // Estructura esperada:
            // { ta_sistolica, ta_diastolica, fc, fr, temperatura, peso, talla, saturacion_o2 }
            $table->jsonb('signos_vitales')
                  ->nullable()
                  ->after('subjetivo')
                  ->comment('SOAP O — Hallazgos objetivos: signos vitales como JSON');

            // ── Idempotencia: una cita → un único detalle de atención ──────────
            $table->unique('id_cita', 'uq_historial_detalle_id_cita');
        });
    }

    public function down(): void
    {
        Schema::table('historial_detalle', function (Blueprint $table) {
            $table->dropUnique('uq_historial_detalle_id_cita');
            $table->dropColumn(['subjetivo', 'signos_vitales']);
        });
    }
};
