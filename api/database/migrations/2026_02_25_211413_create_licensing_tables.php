<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departamento', function (Blueprint $table) {
            $table->integer('codigo_DANE')->primary();
            $table->string('nombre', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('ciudad', function (Blueprint $table) {
            $table->integer('codigo_postal')->primary();
            $table->string('nombre', 50)->nullable();
            $table->integer('id_departamento')->nullable();
            $table->timestamps();

            $table->foreign('id_departamento')->references('codigo_DANE')->on('departamento');
        });

        Schema::create('estado', function (Blueprint $table) {
            $table->id('id_estado');
            $table->string('nombre_estado', 50)->nullable();
        });

        Schema::create('empresa', function (Blueprint $table) {
            $table->string('nit', 20)->primary();
            $table->string('nombre', 150);
            $table->string('email_contacto', 100)->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('direccion', 100)->nullable();
            $table->integer('documento_representante')->unique()->nullable();
            $table->string('nombre_representante', 70)->nullable();
            $table->string('telefono_representante', 30)->nullable();
            $table->string('email_representante', 100)->unique()->nullable();
            $table->integer('id_ciudad')->nullable();
            $table->bigInteger('id_estado')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('id_ciudad')->references('codigo_postal')->on('ciudad');
            $table->foreign('id_estado')->references('id_estado')->on('estado');
        });

        Schema::create('tipo_licencia', function (Blueprint $table) {
            $table->id('id_tipo_licencia');
            $table->string('tipo', 50);
            $table->string('descripcion', 200);
            $table->integer('duracion_meses');
            $table->decimal('precio', 12, 2);
            $table->bigInteger('id_estado')->unsigned();
            $table->timestamps();

            $table->foreign('id_estado')->references('id_estado')->on('estado');
        });

        Schema::create('empresa_licencia', function (Blueprint $table) {
            $table->string('id_empresa_licencia', 12)->primary();
            $table->string('nit', 20);
            $table->bigInteger('id_tipo_licencia')->unsigned();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->bigInteger('id_estado')->unsigned();
            $table->timestamps();

            $table->foreign('nit')->references('nit')->on('empresa');
            $table->foreign('id_tipo_licencia')->references('id_tipo_licencia')->on('tipo_licencia');
            $table->foreign('id_estado')->references('id_estado')->on('estado');
        });

        Schema::create('rol', function (Blueprint $table) {
            $table->id('id_rol');
            $table->string('tipo_usu', 50)->nullable();
        });

        Schema::create('superadmin', function (Blueprint $table) {
            $table->integer('documento')->primary();
            $table->string('nombre', 50)->nullable();
            $table->string('usuario', 50)->unique()->nullable();
            $table->string('email', 100)->unique()->nullable();
            $table->string('contrasena', 500);
            $table->bigInteger('id_rol')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('id_rol')->references('id_rol')->on('rol');
        });

        Schema::create('especialidad', function (Blueprint $table) {
            $table->id('id_especialidad');
            $table->string('especialidad', 150);
        });

        Schema::create('usuario', function (Blueprint $table) {
            $table->bigInteger('documento')->primary();
            $table->string('primer_nombre', 50)->nullable();
            $table->string('segundo_nombre', 40)->nullable();
            $table->string('primer_apellido', 50)->nullable();
            $table->string('segundo_apellido', 40)->nullable();
            $table->string('email', 100)->unique()->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('direccion', 150)->nullable();
            $table->string('sexo', 10)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('grupo_sanguineo', 3)->nullable();
            $table->string('contrasena', 500);
            $table->string('registro_profesional', 50)->nullable();
            $table->string('nit', 20);
            $table->bigInteger('id_rol')->unsigned();
            $table->bigInteger('id_estado')->unsigned();
            $table->bigInteger('id_especialidad')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('nit')->references('nit')->on('empresa');
            $table->foreign('id_rol')->references('id_rol')->on('rol');
            $table->foreign('id_estado')->references('id_estado')->on('estado');
            $table->foreign('id_especialidad')->references('id_especialidad')->on('especialidad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario');
        Schema::dropIfExists('especialidad');
        Schema::dropIfExists('superadmin');
        Schema::dropIfExists('rol');
        Schema::dropIfExists('empresa_licencia');
        Schema::dropIfExists('tipo_licencia');
        Schema::dropIfExists('empresa');
        Schema::dropIfExists('estado');
        Schema::dropIfExists('ciudad');
        Schema::dropIfExists('departamento');
    }
};
