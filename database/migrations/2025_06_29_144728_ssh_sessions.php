<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('ssh_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('name');               // Nombre amigable: "Servidor AWS"
            $table->string('host');               // IP o dominio
            $table->unsignedSmallInteger('port')->default(22); // Puerto, por defecto 22
            $table->string('username');           // Usuario SSH
            $table->string('password')->nullable();      // Opcional: autenticación por contraseña
            $table->text('private_key')->nullable();     // Opcional: autenticación por clave privada
            $table->text('description')->nullable();     // Opcional: para mostrar en el frontend
            $table->boolean('use_private_key')->default(false); // ¿Usar clave privada?
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('ssh_sessions');
    }
};
