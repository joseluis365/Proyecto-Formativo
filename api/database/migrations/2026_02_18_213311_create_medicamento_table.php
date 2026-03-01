<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicamento', function (Blueprint $table) {
            $table->id('id_medicamento');
            $table->string('nombre', 150)->nullable();
            $table->string('presentacion', 100)->nullable();
            $table->text('descripcion')->nullable();
            $table->integer('stock_disponible')->nullable();
            $table->decimal('precio_unitario', 11, 2)->nullable();
            $table->unsignedBigInteger('id_categoria')->nullable();
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_categoria')
                  ->references('id_categoria')
                  ->on('categoria_medicamento')
                  ->onDelete('restrict');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicamento');
    }
};
