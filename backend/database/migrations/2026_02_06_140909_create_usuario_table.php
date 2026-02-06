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
    Schema::create('usuario', function (Blueprint $table) {
        $table->integer('documento')->primary();
        $table->string('nombre', 50);
        $table->string('apellido', 50);
        $table->string('email', 100)->unique();
        $table->string('telefono', 30)->nullable();
        $table->string('direccion', 150)->nullable();
        $table->enum('sexo', ['Masculino','Femenino']);
        $table->date('fecha_nacimiento');
        $table->string('grupo_sanguineo', 3);
        $table->string('contrasena', 500);
        $table->string('registro_profesional', 50)->nullable();
        $table->integer('id_empresa')->nullable();
        $table->integer('id_rol');
        $table->integer('id_estado');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usuario');
    }
};
