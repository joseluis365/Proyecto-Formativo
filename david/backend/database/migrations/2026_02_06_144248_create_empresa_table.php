<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empresa', function (Blueprint $table) {
    $table->string('nit', 20)->primary();
    $table->string('nombre', 150);
    $table->string('email_contacto', 100)->nullable();
    $table->string('telefono', 30)->nullable();
    $table->string('direccion', 100)->nullable();
    $table->unsignedBigInteger('id_estado');
    $table->timestamps();

    $table->foreign('id_estado')->references('id_estado')->on('estado');
});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empresa');
    }
};
