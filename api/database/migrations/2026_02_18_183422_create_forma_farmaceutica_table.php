<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forma_farmaceutica', function (Blueprint $table) {
            $table->id('id_forma');
            $table->string('forma_farmaceutica', 50)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forma_farmaceutica');
    }
};
