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
        Schema::table('departamento', function (Blueprint $table) {
            $table->unsignedBigInteger('id_estado')->default(1)->after('nombre');

            $table->foreign('id_estado')
                  ->references('id_estado')
                  ->on('estado')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departamento', function (Blueprint $table) {
            $table->dropForeign(['id_estado']);
            $table->dropColumn('id_estado');
        });
    }
};
