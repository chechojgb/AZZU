<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlPosicion extends Model
{
    use HasFactory;

    protected $table = 'bl_posiciones';
    protected $fillable = ['nivel_id', 'posicion', 'codigo_completo', 'ancho', 'alto', 'profundidad', 'capacidad_maxima', 'ocupada', 'activa'];

    // Relación con nivel
    public function nivel()
    {
        return $this->belongsTo(BlNivelEstanteria::class, 'nivel_id');
    }

    // Relación con inventario detalle
    public function inventarioDetalle()
    {
        return $this->hasMany(BlInventarioDetalle::class, 'posicion_id');
    }

    // Relación con empaques (a través de inventario detalle)
    public function empaques()
    {
        return $this->belongsToMany(BlEmpaque::class, 'bl_inventario_detalle', 'posicion_id', 'empaque_id')
                    ->withPivot('cantidad_actual', 'estado')
                    ->withTimestamps();
    }

    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    public function scopeDisponibles($query)
    {
        return $query->where('ocupada', false);
    }

    // Método para obtener la cantidad actual ocupada
    public function getCantidadOcupadaAttribute()
    {
        return $this->inventarioDetalle()->sum('cantidad_actual');
    }
}