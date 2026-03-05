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
        // Solo creamos las tablas del módulo de licencias si no existen ya
        // Las tablas base (departamento, ciudad, estado, empresa, rol, usuario, etc.) 
        // ya han sido creadas por sus respectivas migraciones individuales.

        if (!Schema::hasTable('tipo_licencia')) {
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
        }

        if (!Schema::hasTable('empresa_licencia')) {
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
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresa_licencia');
        Schema::dropIfExists('tipo_licencia');
    }
};
