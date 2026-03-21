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
        Schema::table('cita', function (Blueprint $table) {
            $table->dropForeign(['tipo_cita_id']);
            $table->dropColumn('tipo_cita_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cita', function (Blueprint $table) {
            $table->unsignedBigInteger('tipo_cita_id')->nullable();
            $table->foreign('tipo_cita_id')->references('id_tipo_cita')->on('tipo_cita');
        });
    }
};
