<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_medicamento', function (Blueprint $table) {
            $table->id('id_detalle_medicamento');
            $table->unsignedBigInteger('id_orden');
            $table->unsignedBigInteger('id_medicamento');
            $table->string('dosis', 100);
            $table->string('frecuencia', 100);
            $table->string('duracion', 100);
            $table->text('observaciones')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_orden')
                  ->references('id_orden')
                  ->on('orden_medicamento')
                  ->onDelete('restrict');

            $table->foreign('id_medicamento')
                  ->references('id_medicamento')
                  ->on('medicamento')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_medicamento');
    }
};
