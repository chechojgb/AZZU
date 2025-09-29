<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlInventarioDetalle extends Model
{
    use HasFactory;

    protected $table = 'bl_inventario_detalle';

    protected $fillable = [
        'producto_id',   // 🔄 antes era empaque_id
        'zona_id',
        'cantidad_actual',
        'fecha_ubicacion',
        'fecha_vencimiento',
        'estado',
        'notas'
    ];

    protected $dates = ['fecha_ubicacion', 'fecha_vencimiento'];

    // Relación directa con producto (nuevo)
    public function producto()
    {
        return $this->belongsTo(BlProducto::class, 'producto_id');
    }

    // Relación con zona (reemplaza posición)
    public function zona()
    {
        return $this->belongsTo(BlZonaNivel::class, 'zona_id');
    }

    // 🔥 Elimino la relación con empaque porque ya no aplica

    // Scopes útiles ACTUALIZADOS
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'disponible');
    }

    public function scopeEnEstanteria($query, $estanteriaId)
    {
        return $query->whereHas('zona.nivel.estanteria', function($q) use ($estanteriaId) {
            $q->where('id', $estanteriaId);
        });
    }

    public function scopeEnZona($query, $zonaId)
    {
        return $query->where('zona_id', $zonaId);
    }

    public function scopeConProducto($query, $productoId)
    {
        return $query->where('producto_id', $productoId);
    }

    // Nuevo scope para buscar por código de zona
    public function scopeEnZonaCodigo($query, $codigoZona)
    {
        return $query->whereHas('zona', function($q) use ($codigoZona) {
            $q->where('codigo_completo', $codigoZona);
        });
    }

    // Scope para productos próximos a vencer
    public function scopeProximosAVencer($query, $dias = 30)
    {
        return $query->whereDate('fecha_vencimiento', '<=', now()->addDays($dias))
                     ->where('estado', 'disponible');
    }
}
