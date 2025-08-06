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
        Schema::table('bl_empaques', function (Blueprint $table) {
            $table->string('estado')->nullable()->after('codigo_barras');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bl_empaques', function (Blueprint $table) {
            $table->string('estado');
        });
    }

};
