<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cita', function (Blueprint $table) {
            $table->id('id_cita');
            $table->unsignedBigInteger('doc_paciente')->nullable();
            $table->unsignedBigInteger('doc_medico')->nullable();
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->string('motivo', 300)->nullable();
            $table->unsignedBigInteger('tipo_cita_id')->nullable();
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            // Foreign Keys
            $table->foreign('doc_paciente')
                  ->references('documento')
                  ->on('usuario')
                  ->onDelete('restrict');

            $table->foreign('doc_medico')
                  ->references('documento')
                  ->on('usuario')
                  ->onDelete('restrict');

            $table->foreign('tipo_cita_id')
                  ->references('id_tipo_cita')
                  ->on('tipo_cita')
                  ->onDelete('restrict');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');
        });

        // Índice en fecha
        Schema::table('cita', function (Blueprint $table) {
            $table->index('fecha', 'idx_cita_fecha');
        });

        // Función del trigger
        DB::statement("
            CREATE OR REPLACE FUNCTION prevent_past_cita_edit()
            RETURNS trigger AS $$
            BEGIN
                IF OLD.fecha < CURRENT_DATE THEN
                    RAISE EXCEPTION 'No se pueden editar citas pasadas';
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ");

        // Trigger
        DB::statement("
            CREATE TRIGGER trg_prevent_past_cita_edit
            BEFORE UPDATE ON cita
            FOR EACH ROW
            EXECUTE FUNCTION prevent_past_cita_edit();
        ");
    }

    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS trg_prevent_past_cita_edit ON cita');
        DB::statement('DROP FUNCTION IF EXISTS prevent_past_cita_edit');
        Schema::dropIfExists('cita');
    }
};
