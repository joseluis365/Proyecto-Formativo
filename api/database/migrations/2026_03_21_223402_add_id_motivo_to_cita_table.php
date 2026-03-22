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
            $table->unsignedBigInteger('id_motivo')->nullable()->after('id_especialidad');
            $table->foreign('id_motivo')->references('id_motivo')->on('motivo_consulta')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cita', function (Blueprint $table) {
            $table->dropForeign(['id_motivo']);
            $table->dropColumn('id_motivo');
        });
    }
};
