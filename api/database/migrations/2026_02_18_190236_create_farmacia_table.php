<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmacia', function (Blueprint $table) {
            $table->string('nit', 20)->primary();
            $table->string('nombre', 100);
            $table->string('direccion', 150)->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('nombre_contacto', 100)->nullable();
            $table->time('horario_apertura')->nullable();
            $table->time('horario_cierre')->nullable();
            $table->boolean('abierto_24h')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmacia');
    }
};
