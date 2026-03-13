<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla de notificaciones internas para usuarios del sistema.
     * Usada principalmente para recordatorios de citas y alertas del sistema.
     */
    public function up(): void
    {
        Schema::create('notificacion', function (Blueprint $table) {
            $table->id('id_notificacion');

            // Destinatario (paciente u otro usuario)
            $table->unsignedBigInteger('doc_usuario');
            $table->foreign('doc_usuario')
                  ->references('documento')
                  ->on('usuario')
                  ->onDelete('cascade');

            // Referencia opcional a una cita
            $table->unsignedBigInteger('id_cita')->nullable();
            $table->foreign('id_cita')
                  ->references('id_cita')
                  ->on('cita')
                  ->onDelete('set null');

            $table->string('titulo', 150);
            $table->text('mensaje');

            // Tipo: 'recordatorio', 'sistema', 'informacion'
            $table->string('tipo', 50)->default('informacion');

            // Leída por el usuario
            $table->boolean('leida')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificacion');
    }
};
