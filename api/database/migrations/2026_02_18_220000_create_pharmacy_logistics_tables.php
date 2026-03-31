<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Receta (Alternative used in some parts of final.sql, complementary to orden_medicamento)
        Schema::create('receta', function (Blueprint $table) {
            $table->id('id_receta');
            $table->unsignedBigInteger('id_detalle_cita');
            $table->date('fecha_vencimiento');
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->timestamps();

            $table->foreign('id_detalle_cita')->references('id_detalle')->on('historial_detalle');
            $table->foreign('id_estado')->references('id_estado')->on('estado');
        });

        // 2. Receta Detalle (Equivalent to detalle_medicamento in final.sql context)
        Schema::create('receta_detalle', function (Blueprint $table) {
            $table->id('id_detalle_receta');
            $table->unsignedBigInteger('id_receta');
            $table->unsignedBigInteger('id_presentacion');
            $table->string('dosis', 100);
            $table->string('frecuencia', 100);
            $table->string('duracion', 100);
            $table->text('observaciones')->nullable();
            $table->string('nit_farmacia')->nullable();
            $table->integer('cantidad_dispensar')->nullable();
            $table->timestamps();

            $table->foreign('id_receta')->references('id_receta')->on('receta');
            $table->foreign('id_presentacion')->references('id_presentacion')->on('presentacion_medicamento');
        });

        // 3. Lote Medicamento
        Schema::create('lote_medicamento', function (Blueprint $table) {
            $table->id('id_lote');
            $table->unsignedBigInteger('id_presentacion')->nullable();
            $table->string('nit_farmacia')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->integer('stock_actual')->nullable();
            $table->timestamps();

            $table->foreign('id_presentacion')->references('id_presentacion')->on('presentacion_medicamento');
        });

        // 4. Inventario Farmacia
        Schema::create('inventario_farmacia', function (Blueprint $table) {
            $table->id('id_inventario');
            $table->string('nit_farmacia', 12);
            $table->unsignedBigInteger('id_presentacion');
            $table->integer('stock_actual')->nullable();
            $table->timestamps();

            $table->foreign('id_presentacion')->references('id_presentacion')->on('presentacion_medicamento');
        });

        // 5. Dispensacion Farmacia
        Schema::create('dispensacion_farmacia', function (Blueprint $table) {
            $table->id('id_dispensacion');
            $table->unsignedBigInteger('id_detalle_receta');
            $table->string('nit_farmacia');
            $table->integer('cantidad')->nullable();
            $table->timestamp('fecha_dispensacion')->nullable();
            $table->integer('documento_farmaceutico')->nullable();
            $table->integer('id_estado')->nullable();
            $table->timestamps();

            $table->foreign('id_detalle_receta')->references('id_detalle_receta')->on('receta_detalle');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispensacion_farmacia');
        Schema::dropIfExists('inventario_farmacia');
        Schema::dropIfExists('lote_medicamento');
        Schema::dropIfExists('receta_detalle');
        Schema::dropIfExists('receta');
    }
};
