<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('superadmin', function (Blueprint $table) {
            $table->unsignedBigInteger('documento')->primary();
            $table->string('nombre', 50)->nullable();
            $table->string('usuario', 50)->nullable()->unique();
            $table->string('email', 100)->nullable()->unique();
            $table->string('contrasena', 500);
            $table->unsignedBigInteger('id_rol')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_rol')
                  ->references('id_rol')
                  ->on('rol')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('superadmin');
    }
};
