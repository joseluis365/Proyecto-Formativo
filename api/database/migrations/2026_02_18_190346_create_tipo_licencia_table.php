<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_licencia', function (Blueprint $table) {
            $table->id('id_tipo_licencia');
            $table->string('tipo', 50);
            $table->string('descripcion', 200);
            $table->integer('duracion_meses');
            $table->decimal('precio', 12, 2);
            $table->unsignedBigInteger('id_estado');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');
        });

        // Checks (PostgreSQL)
        DB::statement('ALTER TABLE tipo_licencia ADD CONSTRAINT tipo_licencia_duracion_meses_check CHECK (duracion_meses > 0)');
        DB::statement('ALTER TABLE tipo_licencia ADD CONSTRAINT tipo_licencia_precio_check CHECK (precio > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_licencia');
    }
};
