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
        Schema::create('historial_reportes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_usuario')->nullable(); // Guardaremos el documento aquí
            $table->string('tabla_relacion');
            $table->integer('num_registros');
            $table->json('ejemplo_registro')->nullable();
            $table->timestamps();

            $table->foreign('id_usuario')->references('documento')->on('usuario')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_reportes');
    }
};
