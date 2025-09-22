<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bl_cuenta_cobro_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cuenta_cobro_id')->constrained('bl_cuentas_cobro');
            $table->foreignId('marcacion_id')->constrained('bl_marcacion');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bl_cuenta_cobro_items');
    }
};
