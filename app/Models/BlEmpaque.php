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
    public function inventarioDetalle()
    {
        return $this->hasMany(BlInventarioDetalle::class, 'empaque_id');
    }

    // Relación directa con posiciones a través de inventario_detalle
    public function posiciones()
    {
        return $this->belongsToMany(BlPosicion::class, 'bl_inventario_detalle', 'empaque_id', 'posicion_id')
                    ->withPivot('cantidad_actual', 'estado', 'fecha_ubicacion')
                    ->withTimestamps();
    }

    // Scope para empaques disponibles
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'disponible');
    }

    // Scope para empaques sin ubicación
    public function scopeSinUbicacion($query)
    {
        return $query->whereDoesntHave('inventarioDetalle');
    }

    // Scope para empaques con ubicación
    public function scopeConUbicacion($query)
    {
        return $query->whereHas('inventarioDetalle');
    }

    // Método para verificar si tiene ubicación
    public function getTieneUbicacionAttribute()
    {
        return $this->inventarioDetalle()->exists();
    }

    // Método para obtener la ubicación actual (si tiene)
    public function getUbicacionActualAttribute()
    {
        return $this->inventarioDetalle()->first();
    }

    // Método para obtener la cantidad total en inventario
    public function getCantidadEnInventarioAttribute()
    {
        return $this->inventarioDetalle()->sum('cantidad_actual');
    }
}