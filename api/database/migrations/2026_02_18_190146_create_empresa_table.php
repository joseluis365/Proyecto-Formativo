<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresa', function (Blueprint $table) {
            $table->string('nit', 20)->primary();
            $table->string('nombre', 150);
            $table->string('email_contacto', 100)->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('direccion', 100)->nullable();
            $table->integer('documento_representante')->nullable()->unique();
            $table->string('nombre_representante', 70)->nullable();
            $table->string('telefono_representante', 30)->nullable();
            $table->string('email_representante', 100)->nullable()->unique();
            $table->integer('id_ciudad')->nullable();
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_ciudad')
                  ->references('codigo_postal')
                  ->on('ciudad')
                  ->onDelete('restrict');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresa');
    }
};
