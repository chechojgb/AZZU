<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bl_cuentas_cobro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // trabajador
            $table->date('fecha');
            $table->decimal('total', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bl_cuentas_cobro');
    }
};
