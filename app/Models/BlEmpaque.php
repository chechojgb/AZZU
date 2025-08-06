<?php
// app/Models/BlEmpaque.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlEmpaque extends Model
{
    protected $table = 'bl_empaques';
    protected $fillable = ['producto_id', 'codigo_unico', 'cantidad_por_empaque', 'codigo_barras', 'estado'];

    // Relación: Un empaque pertenece a un producto
    public function producto(): BelongsTo
    {
        return $this->belongsTo(BlProducto::class, 'producto_id');
    }

    // Relación: Un empaque puede tener muchos movimientos
    public function movimientos(): HasMany
    {
        return $this->hasMany(BlMovimiento::class, 'empaque_id');
    }

    // Accesor: Total de unidades en stock para este empaque
    public function getStockUnidadesAttribute(): int
    {
        return $this->movimientos->sum('cantidad') * $this->cantidad_por_empaque;
    }
    public function pedidoItems(): HasMany
    {
        return $this->hasMany(BLPedidoItem::class, 'empaque_id');
    }
}