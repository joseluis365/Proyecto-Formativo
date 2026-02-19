<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orden_medicamento', function (Blueprint $table) {
            $table->id('id_orden');
            $table->unsignedBigInteger('id_detalle_cita');
            $table->string('nit_farmacia', 20);
            $table->date('fecha_vencimiento');
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_detalle_cita')
                  ->references('id_detalle')
                  ->on('historial_detalle')
                  ->onDelete('restrict');

            $table->foreign('nit_farmacia')
                  ->references('nit')
                  ->on('farmacia')
                  ->onDelete('cascade');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orden_medicamento');
    }
};
