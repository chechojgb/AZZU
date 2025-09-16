<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class BLPedidoItem extends Model
{
      protected $table = 'bl_pedido_items';

    protected $fillable = [
        'pedido_id',
        'empaque_id',
        'cantidad_empaques',
        'precio_unitario',
        'nota'
    ];

    // Relación: Un item pertenece a un pedido
    public function pedido(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BLPedido::class, 'pedido_id');
    }

    // Relación: Un item referencia un empaque específico
    public function empaque(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BlEmpaque::class, 'empaque_id');
    }
    
    public function marcaciones()
    {
        return $this->hasMany(BLMarcacion::class, 'pedido_item_id');
    }

    public function movimientos(): MorphMany
    {
        return $this->morphMany(BlMovimiento::class, 'movible');
    }
}
