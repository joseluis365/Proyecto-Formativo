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
        Schema::table('receta_detalle', function (Blueprint $table) {
            $table->integer('cantidad_dispensar')->nullable()->after('id_presentacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receta_detalle', function (Blueprint $table) {
            $table->dropColumn('cantidad_dispensar');
        });
    }
};
