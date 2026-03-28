<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categoria_examen', function (Blueprint $table) {
            $table->id('id_categoria_examen');
            $table->string('categoria', 100)->nullable();
            $table->unsignedBigInteger('id_estado')->default(1)->nullable();
            $table->timestamps();
            $table->boolean('requiere_ayuno')->default(false);

            $table->foreign('id_estado')->references('id_estado')->on('estado')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categoria_examen');
    }
};
