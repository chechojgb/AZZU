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
        Schema::create('bl_marcacion', function (Blueprint $table) {
            $table->id();

            // relaciones
            $table->unsignedBigInteger('pedido_id');
            $table->unsignedBigInteger('pedido_item_id');
            $table->unsignedBigInteger('user_id'); // trabajador
            // info de marcación
            $table->integer('cantidad')->default(0);
            $table->date('fecha');
            $table->timestamps();
            // índices
            $table->index('pedido_id');
            $table->index('pedido_item_id');
            $table->index('user_id');
            $table->index('fecha');
            // foreign keys
            $table->foreign('pedido_id')
                ->references('id')->on('bl_pedidos')
                ->onDelete('cascade');
            $table->foreign('pedido_item_id')
                ->references('id')->on('bl_pedido_items')
                ->onDelete('cascade');
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bl_marcacion');
    }
};
