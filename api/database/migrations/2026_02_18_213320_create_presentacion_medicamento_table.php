<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presentacion_medicamento', function (Blueprint $table) {
            $table->id('id_presentacion');
            $table->unsignedBigInteger('id_medicamento')->nullable();
            $table->unsignedBigInteger('id_concentracion')->nullable();
            $table->unsignedBigInteger('id_forma_farmaceutica')->nullable();
            $table->decimal('precio_unitario', 10, 2)->nullable();
            $table->timestamps();

            $table->foreign('id_medicamento')->references('id_medicamento')->on('medicamento')->onDelete('cascade');
            $table->foreign('id_concentracion')->references('id_concentracion')->on('concentracion')->onDelete('cascade');
            $table->foreign('id_forma_farmaceutica')->references('id_forma')->on('forma_farmaceutica')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presentacion_medicamento');
    }
};
