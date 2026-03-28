<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motivo_consulta', function (Blueprint $table) {
            $table->id('id_motivo');
            $table->text('motivo')->nullable();
            $table->unsignedBigInteger('id_estado')->default(1)->nullable();
            $table->timestamps();

            $table->foreign('id_estado')->references('id_estado')->on('estado')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motivo_consulta');
    }
};
