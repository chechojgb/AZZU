<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlInventarioDetalle extends Model
{
    use HasFactory;

    protected $table = 'bl_inventario_detalle';
    protected $fillable = [
        'empaque_id', 
        'zona_id', // Cambiado: posicion_id → zona_id
        'cantidad_actual', 
        'fecha_ubicacion', 
        'fecha_vencimiento', 
        'estado', 
        'notas'
    ];

    protected $dates = ['fecha_ubicacion', 'fecha_vencimiento'];

    // Relación con empaque
    public function empaque()
    {
        return $this->belongsTo(BlEmpaque::class, 'empaque_id');
    }

    // NUEVA RELACIÓN con zona (reemplaza posicion)
    public function zona()
    {
        return $this->belongsTo(BlZonaNivel::class, 'zona_id');
    }

    // Relación con producto (a través de empaque)
    public function producto()
    {
        return $this->hasOneThrough(
            BlProducto::class, 
            BlEmpaque::class,
            'id', // Foreign key on bl_empaques table
            'id', // Foreign key on bl_productos table  
            'empaque_id', // Local key on bl_inventario_detalle table
            'producto_id' // Local key on bl_empaques table
        );
    }

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
        return $query->whereHas('empaque', function($q) use ($productoId) {
            $q->where('producto_id', $productoId);
        });
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