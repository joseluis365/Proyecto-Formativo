<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cambia el tipo de id_empresa_licencia de BIGINT a VARCHAR(12).
     */
    public function up(): void
    {
        Schema::table('empresa_licencia', function (Blueprint $table) {
            // En PostgreSQL, para cambiar un BIGINT (especialmente si es auto-increment) 
            // a VARCHAR, es más seguro usar una sentencia SQL directa con casting.
            DB::statement('ALTER TABLE empresa_licencia ALTER COLUMN id_empresa_licencia TYPE VARCHAR(12) USING id_empresa_licencia::VARCHAR');
            
            // Eliminamos el valor por defecto de la secuencia (auto-increment) ya que ahora es VARCHAR
            DB::statement('ALTER TABLE empresa_licencia ALTER COLUMN id_empresa_licencia DROP DEFAULT');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresa_licencia', function (Blueprint $table) {
            // Revertimos a BIGINT. 
            // Nota: Esto fallará si hay valores en el VARCHAR que no sean numéricos.
            DB::statement('ALTER TABLE empresa_licencia ALTER COLUMN id_empresa_licencia TYPE BIGINT USING id_empresa_licencia::BIGINT');
            
            // Intentar restaurar la secuencia si es necesario, 
            // aunque usualmente para el propósito de reversión técnica esto es suficiente.
        });
    }
};
