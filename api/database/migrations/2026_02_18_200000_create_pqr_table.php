<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pqr', function (Blueprint $table) {
            $table->id('id_pqr');
            $table->string('nombre_usuario', 150)->nullable();
            $table->string('email', 200)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('asunto', 50)->nullable();
            $table->text('mensaje')->nullable();
            $table->text('respuesta')->nullable();
            $table->integer('id_estado');
            
            $table->foreign('id_estado')->references('id_estado')->on('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pqr');
    }
};
