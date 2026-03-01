<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Agrega la columna id_estado para sincronizar con la base de datos existente.
     */
    public function up(): void
    {
        if (Schema::hasTable('empresa_licencia') && !Schema::hasColumn('empresa_licencia', 'id_estado')) {
            Schema::table('empresa_licencia', function (Blueprint $table) {
                // Se agrega como integer y NOT NULL. 
                // Se incluye un default(1) para evitar errores si hay registros previos.
                $table->integer('id_estado')->default(1)->after('fecha_fin');

                $table->foreign('id_estado')
                    ->references('id_estado')
                    ->on('estado');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('empresa_licencia') && Schema::hasColumn('empresa_licencia', 'id_estado')) {
            Schema::table('empresa_licencia', function (Blueprint $table) {
                $table->dropForeign(['id_estado']);
                $table->dropColumn('id_estado');
            });
        }
    }
};
