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
        Schema::table('bl_marcacion', function (Blueprint $table) {
            $table->decimal('precio_unitario', 10, 2)->nullable()->after('cantidad');
            $table->decimal('costo_total', 10, 2)->nullable()->after('precio_unitario');
        });
    }

    public function down(): void
    {
        Schema::table('bl_marcacion', function (Blueprint $table) {
            $table->dropColumn(['precio_unitario', 'costo_total']);
        });
    }

};
