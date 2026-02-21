<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresa_licencia', function (Blueprint $table) {
            $table->bigIncrements('id_empresa_licencia');

            $table->string('nit'); // FK a empresa
            $table->unsignedBigInteger('id_tipo_licencia');

            $table->date('fecha_inicio');
            $table->date('fecha_fin');

            $table->timestamps();

            $table->foreign('nit')
                ->references('nit')
                ->on('empresa')
                ->onDelete('cascade');

            $table->foreign('id_tipo_licencia')
                ->references('id_tipo_licencia')
                ->on('tipo_licencia')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresa_licencia');
    }
};