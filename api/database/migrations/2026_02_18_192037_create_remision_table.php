<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('remision', function (Blueprint $table) {
            $table->id('id_remision');
            $table->unsignedBigInteger('id_detalle_cita');
            $table->string('tipo_remision', 10)->nullable();
            $table->unsignedBigInteger('id_especialidad')->nullable();
            $table->unsignedBigInteger('id_examen')->nullable();
            $table->unsignedBigInteger('id_prioridad')->nullable();
            $table->text('notas');
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_detalle_cita')
                  ->references('id_detalle')
                  ->on('historial_detalle')
                  ->onDelete('restrict');

            $table->foreign('id_especialidad')
                  ->references('id_especialidad')
                  ->on('especialidad')
                  ->onDelete('restrict');

            $table->foreign('id_examen')
                  ->references('id_examen')
                  ->on('examen')
                  ->onDelete('restrict');

            $table->foreign('id_prioridad')
                  ->references('id_prioridad')
                  ->on('prioridad')
                  ->onDelete('restrict');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');
        });

        // Check constraint
        DB::statement("
            ALTER TABLE remision
            ADD CONSTRAINT remision_tipo_remision_check
            CHECK (tipo_remision IN ('cita','examen'))
        ");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE remision DROP CONSTRAINT IF EXISTS remision_tipo_remision_check');
        Schema::dropIfExists('remision');
    }
};
