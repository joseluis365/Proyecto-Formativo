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
        Schema::create('empresa_licencia', function (Blueprint $table) {
    $table->string('id_empresa_licencia', 12)->primary();
    $table->string('nit'); // FK REAL
    $table->unsignedBigInteger('id_tipo_licencia');
    $table->date('fecha_inicio');
    $table->date('fecha_fin');
    $table->unsignedBigInteger('id_estado');
    $table->timestamps();

    $table->foreign('nit')->references('nit')->on('empresa');
    $table->foreign('id_estado')->references('id_estado')->on('estado');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresa_licencia');
    }
};
