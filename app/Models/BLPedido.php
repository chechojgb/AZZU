<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\BLPedidoItem;

class BLPedido extends Model
{
    protected $table = 'bl_pedidos';

    protected $fillable = [
        'cliente_id',
        'fecha_pedido',
        'estado',
        'notas',
        'usuario_id'
    ];

    // Relación: Un pedido pertenece a un cliente
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(BLCliente::class, 'cliente_id');
    }

    // Relación: Un pedido tiene muchos items (empaques)
    public function items(): HasMany
    {
        return $this->hasMany(BLPedidoItem::class, 'pedido_id');
    }

    // Relación: Usuario que registró el pedido (opcional)
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
