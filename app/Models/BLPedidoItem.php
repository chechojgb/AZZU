<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BLPedidoItem extends Model
{
      protected $table = 'bl_pedido_items';

    protected $fillable = [
        'pedido_id',
        'empaque_id',
        'cantidad_empaques',
        'precio_unitario'
    ];

    // Relación: Un item pertenece a un pedido
    public function pedido(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BLPedido::class, 'pedido_id');
    }

    // Relación: Un item referencia un empaque específico
    public function empaque(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BLEmpaque::class, 'empaque_id');
    }
}
