<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        Schema::table('bl_clientes', function (Blueprint $table) {
            $table->string('ciudad')->nullable()->after('email');
        });
    }

    public function down()
    {
        Schema::table('bl_clientes', function (Blueprint $table) {
            $table->dropColumn('ciudad');
        });
    }

};
