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
            $table->unsignedBigInteger('id_categoria_examen')->nullable()->after('id_examen');
            $table->boolean('requiere_ayuno')->default(false)->after('id_categoria_examen');

            $table->foreign('id_categoria_examen')
                  ->references('id_categoria_examen')
                  ->on('categoria_examen')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('remision', function (Blueprint $table) {
            $table->dropForeign(['id_categoria_examen']);
            $table->dropColumn(['id_categoria_examen', 'requiere_ayuno']);
        });
    }
};
