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
        Schema::table('movimiento_inventario', function (Blueprint $table) {
            $table->string('nit_farmacia', 20);

            $table->foreign('nit_farmacia')
                ->references('nit')
                ->on('farmacia')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimiento_inventario', function (Blueprint $table) {
            $table->dropForeign(['nit_farmacia']);
            $table->dropColumn('nit_farmacia');
        });
    }
};
