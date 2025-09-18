<?php
// app/Models/BlEmpaque.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

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
    public function movimientos(): MorphMany
    {
        return $this->morphMany(BlMovimiento::class, 'movible');
    }

    // Accesor: Total de unidades en stock para este empaque
    public function getStockUnidadesAttribute(): int
    {
        $entradas = $this->movimientos()->where('tipo', 'entrada')->sum('cantidad');
        $salidas  = $this->movimientos()->where('tipo', 'salida')->sum('cantidad');
        $ajustes  = $this->movimientos()->where('tipo', 'ajuste')->sum('cantidad');

        $totalEmpaques = $entradas - $salidas + $ajustes;

        return $totalEmpaques * $this->cantidad_por_empaque;
    }
    public function pedidoItems(): HasMany
    {
        return $this->hasMany(BLPedidoItem::class, 'empaque_id');
    }
}