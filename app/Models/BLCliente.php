<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\BLPedido;

class BLCliente extends Model
{
    protected $table = 'bl_clientes';

    protected $fillable = [
        'nombre',
        'contacto',
        'nit',
        'telefono',
        'email',
        'ciudad',
        'direccion',
    ];

    // Relación: Un cliente tiene muchos pedidos
    public function pedidos(): HasMany
    {
        return $this->hasMany(BLPedido::class, 'cliente_id');
    }
    public function movimientos(): MorphMany
    {
        return $this->morphMany(BlMovimiento::class, 'movible');
    }
}
