<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concentracion', function (Blueprint $table) {
            $table->id('id_concentracion');
            $table->string('concentracion', 20)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concentracion');
    }
};
