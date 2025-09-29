<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlProducto extends Model
{
    protected $table = 'bl_productos';
    protected $fillable = ['tipo_producto', 'tamanio', 'color_id', 'cantidad_por_empaque', 'codigo_barras', 'descripcion'];

    // Relación: Un producto pertenece a un color
    public function color(): BelongsTo
    {
        return $this->belongsTo(BlColor::class, 'color_id');
    }

    // Relación: Un producto puede tener muchos empaques
    public function empaques(): HasMany
    {
        return $this->hasMany(BlEmpaque::class, 'producto_id');
    }

    // ✅ Relación DIRECTA con inventarioDetalle (usando producto_id)
    public function inventarioDetalle(): HasMany
    {
        return $this->hasMany(BlInventarioDetalle::class, 'producto_id');
    }

    // Accesor: Descripción automática (ej: "BT 20MM Dorado")
    public function getDescripcionAttribute(): string
    {
        return "{$this->tipo_producto} {$this->tamanio} {$this->color->codigo}";
    }
}