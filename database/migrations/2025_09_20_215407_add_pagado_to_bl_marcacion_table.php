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
            $table->boolean('pagado')->default(false)->after('costo_total');
        });
    }

    public function down(): void
    {
        Schema::table('bl_marcacion', function (Blueprint $table) {
            $table->dropColumn('pagado');
        });
    }
};
