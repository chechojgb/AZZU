<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlInventarioDetalle extends Model
{
    use HasFactory;

    protected $table = 'bl_inventario_detalle';
    protected $fillable = [
        'empaque_id', 'posicion_id', 'cantidad_actual', 
        'fecha_ubicacion', 'fecha_vencimiento', 'estado', 'notas'
    ];

    protected $dates = ['fecha_ubicacion', 'fecha_vencimiento'];

    // Relación con empaque
    public function empaque()
    {
        return $this->belongsTo(BlEmpaque::class, 'empaque_id');
    }

    // Relación con posición
    public function posicion()
    {
        return $this->belongsTo(BlPosicion::class, 'posicion_id');
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

    // Scopes útiles
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'disponible');
    }

    public function scopeEnEstanteria($query, $estanteriaId)
    {
        return $query->whereHas('posicion.nivel.estanteria', function($q) use ($estanteriaId) {
            $q->where('id', $estanteriaId);
        });
    }

    public function scopeConProducto($query, $productoId)
    {
        return $query->whereHas('empaque', function($q) use ($productoId) {
            $q->where('producto_id', $productoId);
        });
    }
}