<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('respaldo_empresa', function (Blueprint $table) {
            $table->id('id_respaldo');
            $table->string('nit_empresa', 20)->nullable();
            $table->string('nombre_representante', 150)->nullable();
            $table->string('documento_representante', 50)->nullable();
            $table->string('telefono_representante', 20)->nullable();
            $table->string('email_representante', 100)->nullable();
            $table->timestamp('fecha_respaldo')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('respaldo_empresa');
    }
};
