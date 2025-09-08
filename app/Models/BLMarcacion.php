<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BLMarcacion extends Model
{
    protected $table = 'bl_marcacion';

    protected $fillable = [
        'pedido_id',
        'pedido_item_id',
        'user_id',
        'cantidad',
        'fecha',
        'precio_unitario',
        'costo_total'
    ];

    protected $casts = [
        'items_marcados' => 'array', // para que se convierta automáticamente a array
        'fecha' => 'date',
    ];

    // Relaciones opcionales
    public function cliente()
    {
        return $this->belongsTo(BLCliente::class, 'cliente_id');
    }

    public function pedido()
    {
        return $this->belongsTo(BLPedido::class, 'pedido_id');
    }

    public function trabajador()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
