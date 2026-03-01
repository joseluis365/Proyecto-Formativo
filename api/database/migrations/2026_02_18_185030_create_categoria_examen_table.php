<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categoria_examen', function (Blueprint $table) {
            $table->id('id_categoria_examen');
            $table->string('categoria', 100)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categoria_examen');
    }
};
