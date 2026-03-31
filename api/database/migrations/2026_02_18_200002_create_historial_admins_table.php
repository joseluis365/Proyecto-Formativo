<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_admins', function (Blueprint $table) {
            $table->unsignedBigInteger('documento');
            $table->string('primer_nombre', 50);
            $table->string('segundo_nombre', 50)->nullable();
            $table->string('primer_apellido', 50);
            $table->string('segundo_apellido', 50)->nullable();
            $table->string('email', 100);
            $table->string('telefono', 20);
            $table->string('contrasena', 500);
            $table->string('nit', 20);
            $table->timestamp('fecha_respaldo')->useCurrent();
            
            $table->primary(['documento', 'fecha_respaldo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_admins');
    }
};
