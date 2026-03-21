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
        Schema::table('remision', function (Blueprint $table) {
            $table->unsignedBigInteger('id_cita')->nullable()->after('id_detalle_cita');
            
            $table->foreign('id_cita')
                  ->references('id_cita')
                  ->on('cita')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('remision', function (Blueprint $table) {
            //
        });
    }
};
