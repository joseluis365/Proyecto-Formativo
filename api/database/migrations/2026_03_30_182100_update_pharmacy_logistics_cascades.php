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
        Schema::table('lote_medicamento', function (Blueprint $table) {
            $table->dropForeign(['id_presentacion']);
            $table->foreign('id_presentacion')
                ->references('id_presentacion')
                ->on('presentacion_medicamento')
                ->onDelete('cascade');
        });

        Schema::table('inventario_farmacia', function (Blueprint $table) {
            $table->dropForeign(['id_presentacion']);
            $table->foreign('id_presentacion')
                ->references('id_presentacion')
                ->on('presentacion_medicamento')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lote_medicamento', function (Blueprint $table) {
            $table->dropForeign(['id_presentacion']);
            $table->foreign('id_presentacion')
                ->references('id_presentacion')
                ->on('presentacion_medicamento')
                ->onDelete('restrict');
        });

        Schema::table('inventario_farmacia', function (Blueprint $table) {
            $table->dropForeign(['id_presentacion']);
            $table->foreign('id_presentacion')
                ->references('id_presentacion')
                ->on('presentacion_medicamento')
                ->onDelete('restrict');
        });
    }
};
