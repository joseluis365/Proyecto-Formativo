<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('superadmin', function (Blueprint $table) {
            $table->integer('documento')->primary();
            $table->string('nombre', 50);
            $table->string('usuario', 50)->unique();
            $table->string('email', 100)->unique();
            $table->string('contrasena', 500);

            // Rol (para futuro super admin / otros niveles)
            $table->unsignedInteger('id_rol');

            $table->timestamps();

            // FK opcional pero recomendable
            $table->foreign('id_rol')
                  ->references('id_rol')
                  ->on('rol');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('superadmin');
    }
};
