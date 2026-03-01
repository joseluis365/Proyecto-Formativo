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
        Schema::table('farmacia', function (Blueprint $table) {
            $table->string('nit_empresa', 20);
            
            $table->foreign('nit_empresa')
                ->references('nit')
                ->on('empresa')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmacia', function (Blueprint $table) {
            $table->dropForeign(['nit_empresa']);
            $table->dropColumn('nit_empresa');
        });
    }
};
