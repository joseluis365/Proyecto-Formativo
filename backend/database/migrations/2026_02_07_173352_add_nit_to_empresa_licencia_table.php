<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('empresa_licencia', function (Blueprint $table) {
            $table->string('nit')->after('id_empresa_licencia');

            $table->foreign('nit')
                ->references('nit')
                ->on('empresa')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('empresa_licencia', function (Blueprint $table) {
            $table->dropForeign(['nit']);
            $table->dropColumn('nit');
        });
    }
};
