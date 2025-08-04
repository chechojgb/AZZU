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
        Schema::create('bl_pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('bl_clientes');
            $table->date('fecha_pedido');
            $table->enum('estado', ['pendiente', 'procesado', 'entregado', 'cancelado']);
            $table->text('notas')->nullable();
            $table->foreignId('usuario_id')->constrained('users'); // Quién registró
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_pedidos');
    }
};
