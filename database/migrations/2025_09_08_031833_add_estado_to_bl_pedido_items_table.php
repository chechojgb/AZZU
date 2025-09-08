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
            $table->string('estado', 20)->default('pendiente')->after('cantidad');
            // $table->index('estado'); // lo pones solo si lo vas a consultar MUCHO
        });
    }

    public function down(): void
    {
        Schema::table('bl_pedido_items', function (Blueprint $table) {
            $table->dropColumn('estado');
            // $table->dropIndex(['estado']); // si agregaste el índice
        });
    }
};
