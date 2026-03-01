<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tipo_licencia', function (Blueprint $table) {
            $table->id('id_tipo_licencia');
            $table->string('tipo', 50);
            $table->string('descripcion', 200);
            $table->integer('duracion_meses')->check('duracion_meses > 0');
            $table->decimal('precio', 12, 2);
            $table->unsignedBigInteger('id_estado');
            $table->timestamps();

            $table->foreign('id_estado')
                ->references('id_estado')
                ->on('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_licencia');
    }
};
