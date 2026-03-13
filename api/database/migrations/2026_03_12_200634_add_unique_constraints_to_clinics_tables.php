<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('historial_clinico', function (Blueprint $table) {
            $table->unique('id_paciente', 'uq_historial_clinico_id_paciente');
        });

        Schema::table('cita', function (Blueprint $table) {
            $table->unique(['doc_medico', 'fecha', 'hora_inicio'], 'uq_cita_medico_fecha_hora');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_clinico', function (Blueprint $table) {
            $table->dropUnique('uq_historial_clinico_id_paciente');
        });

        Schema::table('cita', function (Blueprint $table) {
            $table->dropUnique('uq_cita_medico_fecha_hora');
        });
    }
};
