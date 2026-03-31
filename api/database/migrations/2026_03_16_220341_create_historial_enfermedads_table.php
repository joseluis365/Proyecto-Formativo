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
        Schema::create('historial_enfermedades', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('historial_detalle_id');
            $table->string('enfermedad_codigo_icd');
            $table->timestamps();

            $table->foreign('historial_detalle_id')->references('id_detalle')->on('historial_detalle')->onDelete('cascade');
            $table->foreign('enfermedad_codigo_icd')->references('codigo_icd')->on('enfermedades')->onDelete('cascade');
            
            // Un diagnóstico no debería estar duplicado en la misma consulta
            $table->unique(['historial_detalle_id', 'enfermedad_codigo_icd'], 'historial_enfermedad_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_enfermedades');
    }
};
