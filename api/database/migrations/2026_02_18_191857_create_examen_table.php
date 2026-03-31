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
            $table->unsignedBigInteger('doc_paciente')->nullable();
            $table->date('fecha')->nullable();
            $table->time('hora_inicio')->nullable();
            $table->time('hora_fin')->nullable();
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->string('resultado_pdf', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_categoria_examen')
                  ->references('id_categoria_examen')
                  ->on('categoria_examen')
                  ->onDelete('restrict');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');

            $table->foreign('doc_paciente')
                  ->references('documento')
                  ->on('usuario')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('examen');
    }
};
