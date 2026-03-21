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
        Schema::table('cita', function (Blueprint $table) {
            $table->string('tipo_evento')->default('consulta'); // consulta, remision, examen
            $table->unsignedBigInteger('id_especialidad')->nullable();
            $table->unsignedBigInteger('id_examen')->nullable();
            
            // Permitir nulls para órdenes a futuro que aún no tienen fecha agendada
            $table->date('fecha')->nullable()->change();
            $table->time('hora_inicio')->nullable()->change();
            $table->time('hora_fin')->nullable()->change();

            $table->foreign('id_especialidad')->references('id_especialidad')->on('especialidad')->nullOnDelete();
            $table->foreign('id_examen')->references('id_examen')->on('examen')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cita', function (Blueprint $table) {
            $table->dropForeign(['id_especialidad']);
            $table->dropForeign(['id_examen']);
            
            $table->dropColumn(['tipo_evento', 'id_especialidad', 'id_examen']);
            
            // Revertir a not null (podría fallar si hay nulos guardados, pero es la reversión)
            $table->date('fecha')->nullable(false)->change();
            $table->time('hora_inicio')->nullable(false)->change();
            $table->time('hora_fin')->nullable(false)->change();
        });
    }
};
