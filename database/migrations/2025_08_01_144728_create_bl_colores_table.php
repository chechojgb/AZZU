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
        Schema::create('bl_colores', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10)->unique(); // Ej: "Z6"
            $table->string('nombre', 50);           // Ej: "Dorado"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_colores');
    }
};
