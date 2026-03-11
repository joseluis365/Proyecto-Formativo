<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agrega el campo recordatorio_enviado a la tabla cita.
     *
     * Propósito: bandera de idempotencia para el comando SendAppointmentReminders.
     * Evita enviar recordatorios duplicados si el scheduler corre más de una vez
     * en el mismo día (reinicios, ejecuciones manuales, bugs de cron, etc.).
     *
     * Valor por defecto: false (nunca se ha enviado recordatorio para esta cita).
     */
    public function up(): void
    {
        Schema::table('cita', function (Blueprint $table) {
            $table->boolean('recordatorio_enviado')
                  ->default(false)
                  ->after('id_estado')
                  ->comment('true cuando el recordatorio automático ya fue despachado para esta cita');
        });
    }

    public function down(): void
    {
        Schema::table('cita', function (Blueprint $table) {
            $table->dropColumn('recordatorio_enviado');
        });
    }
};
