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
        Schema::create('activities', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('type'); // pharmacy, system, user, etc.
        $table->string('icon'); // el nombre del icono de Material Symbols
        $table->timestamps();   // Esto nos dará el 'time' (created_at)
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
