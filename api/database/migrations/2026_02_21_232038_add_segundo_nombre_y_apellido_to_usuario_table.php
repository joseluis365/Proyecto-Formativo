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
        Schema::table('usuario', function (Blueprint $table) {
            $table->renameColumn('nombre', 'primer_nombre');
            $table->renameColumn('apellido', 'primer_apellido');
            $table->string('segundo_nombre', 40)->nullable()->after('primer_nombre');
            $table->string('segundo_apellido', 40)->nullable()->after('primer_apellido');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuario', function (Blueprint $table) {
            $table->dropColumn(['segundo_nombre', 'segundo_apellido']);
            $table->renameColumn('primer_nombre', 'nombre');
            $table->renameColumn('primer_apellido', 'apellido');
        });
    }
};
