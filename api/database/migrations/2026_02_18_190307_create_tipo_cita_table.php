<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_cita', function (Blueprint $table) {
            $table->id('id_tipo_cita');
            $table->string('tipo', 50)->nullable();
            $table->foreignId('id_especialidad')->nullable()->constrained('especialidad', 'id_especialidad');
            $table->boolean('acceso_directo')->default(false);
            $table->unsignedBigInteger('id_estado')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_cita');
    }
};
