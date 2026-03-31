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
        Schema::table('movimiento_inventario', function (Blueprint $table) {
            // Eliminar llaves foráneas actuales que bloquean la eliminación
            $table->dropForeign(['id_lote']);
            $table->dropForeign(['id_dispensacion']);

            // Re-agregarlas con onDelete('set null')
            // Esto permite mantener el historial de movimientos aunque el lote sea borrado
            $table->foreign('id_lote')
                ->references('id_lote')
                ->on('lote_medicamento')
                ->onDelete('set null');

            $table->foreign('id_dispensacion')
                ->references('id_dispensacion')
                ->on('dispensacion_farmacia')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimiento_inventario', function (Blueprint $table) {
            $table->dropForeign(['id_lote']);
            $table->dropForeign(['id_dispensacion']);

            $table->foreign('id_lote')
                ->references('id_lote')
                ->on('lote_medicamento')
                ->onDelete('restrict');

            $table->foreign('id_dispensacion')
                ->references('id_dispensacion')
                ->on('dispensacion_farmacia')
                ->onDelete('restrict');
        });
    }
};
