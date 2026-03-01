<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categoria_examen', function (Blueprint $table) {
            $table->unsignedBigInteger('id_estado')->default(1)->after('categoria');
            $table->timestamps();
        });

        DB::table('categoria_examen')->update([
            'id_estado' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Schema::table('categoria_examen', function (Blueprint $table) {
            $table->foreign('id_estado')
                ->references('id_estado')
                ->on('estado')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('categoria_examen', function (Blueprint $table) {
            $table->dropForeign(['id_estado']);
            $table->dropColumn(['id_estado', 'created_at', 'updated_at']);
        });
    }
};