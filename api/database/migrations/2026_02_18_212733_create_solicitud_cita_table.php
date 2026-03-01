<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitud_cita', function (Blueprint $table) {
            $table->id('id_solicitud');
            $table->unsignedBigInteger('id_especialidad')->nullable();
            $table->date('fecha_preferida')->nullable();
            $table->text('motivo')->nullable();
            $table->unsignedBigInteger('id_estado');
            $table->unsignedBigInteger('id_cita')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_especialidad')
                  ->references('id_especialidad')
                  ->on('especialidad')
                  ->onDelete('restrict');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');

            $table->foreign('id_cita')
                  ->references('id_cita')
                  ->on('cita')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitud_cita');
    }
};
