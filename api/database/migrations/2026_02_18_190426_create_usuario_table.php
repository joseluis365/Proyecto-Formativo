<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->unsignedBigInteger('documento')->primary();
            $table->string('nombre', 50)->nullable();
            $table->string('apellido', 50)->nullable();
            $table->string('email', 100)->nullable()->unique();
            $table->string('telefono', 30)->nullable();
            $table->string('direccion', 150)->nullable();
            $table->string('sexo', 10)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('grupo_sanguineo', 3)->nullable();
            $table->string('contrasena', 500);
            $table->string('registro_profesional', 50)->nullable();
            $table->string('nit', 20);
            $table->unsignedBigInteger('id_rol');
            $table->unsignedBigInteger('id_estado');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->unsignedBigInteger('id_especialidad')->nullable();

            // Foreign Keys
            $table->foreign('nit')
                  ->references('nit')
                  ->on('empresa')
                  ->onDelete('restrict');

            $table->foreign('id_rol')
                  ->references('id_rol')
                  ->on('rol')
                  ->onDelete('restrict');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');

            $table->foreign('id_especialidad')
                  ->references('id_especialidad')
                  ->on('especialidad')
                  ->onDelete('restrict');
        });

        // Check constraint para sexo
        DB::statement("ALTER TABLE usuario ADD CONSTRAINT usuario_sexo_check CHECK (sexo IN ('Masculino','Femenino'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
