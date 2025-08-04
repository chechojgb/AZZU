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
        Schema::create('bl_pedido_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('bl_pedidos');
            $table->foreignId('empaque_id')->constrained('bl_empaques');
            $table->integer('cantidad_empaques'); // Ej: 2 empaques de 500 unidades = 1000 botones
            $table->decimal('precio_unitario', 10, 2); // Precio por empaque
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_pedido_items');
    }
};
