<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimiento_inventario', function (Blueprint $table) {
            $table->id('id_movimiento');
            $table->unsignedBigInteger('id_medicamento')->nullable();
            $table->string('tipo_movimiento', 20)->nullable();
            $table->integer('cantidad')->nullable();
            $table->date('fecha')->nullable();
            $table->unsignedBigInteger('documento')->nullable();
            $table->string('motivo', 200)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_medicamento')
                  ->references('id_medicamento')
                  ->on('medicamento')
                  ->onDelete('restrict');

            $table->foreign('documento')
                  ->references('documento')
                  ->on('usuario')
                  ->onDelete('restrict');
        });

        DB::statement("
            ALTER TABLE movimiento_inventario
            ADD CONSTRAINT movimiento_inventario_tipo_movimiento_check
            CHECK (tipo_movimiento IN ('Ingreso','Salida','Reserva'))
        ");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE movimiento_inventario DROP CONSTRAINT IF EXISTS movimiento_inventario_tipo_movimiento_check');
        Schema::dropIfExists('movimiento_inventario');
    }
};
