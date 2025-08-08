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
        Schema::table('bl_pedido_items', function (Blueprint $table) {
            $table->string('nota')->nullable()->after('cantidad_empaques');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bl_pedido_items', function (Blueprint $table) {
            $table->dropColumn('nota');
        });
    }
};
