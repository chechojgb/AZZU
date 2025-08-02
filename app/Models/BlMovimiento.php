<?php

// app/Models/BlMovimiento.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlMovimiento extends Model
{
    protected $table = 'bl_movimientos';
    protected $fillable = ['empaque_id', 'tipo', 'cantidad', 'motivo', 'lote', 'usuario_id'];

    // Tipos de movimiento permitidos
    public const TIPOS = ['entrada', 'salida', 'ajuste'];

    // Relación: Un movimiento pertenece a un empaque
    public function empaque(): BelongsTo
    {
        return $this->belongsTo(BlEmpaque::class, 'empaque_id');
    }

    // Relación: Un movimiento puede tener un usuario asociado (opcional)
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}