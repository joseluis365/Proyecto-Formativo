<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('especialidad', function (Blueprint $table) {
            $table->id('id_especialidad');
            $table->string('especialidad', 150);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('especialidad');
    }
};
