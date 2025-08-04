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
        Schema::create('bl_clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('nit', 20)->nullable(); // Para facturación
            $table->string('telefono', 15);
            $table->string('email', 50)->nullable();
            $table->text('direccion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_clientes');
    }
};
