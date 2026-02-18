<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('examen', function (Blueprint $table) {
            $table->id('id_examen');
            $table->string('nombre', 100);
            $table->unsignedBigInteger('id_categoria_examen')->nullable();
            $table->boolean('requiere_ayuno')->nullable();
            $table->text('descripcion')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_categoria_examen')
                  ->references('id_categoria_examen')
                  ->on('categoria_examen')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('examen');
    }
};
