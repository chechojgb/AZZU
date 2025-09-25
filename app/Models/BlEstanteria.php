<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlEstanteria extends Model
{
    use HasFactory;

    protected $table = 'bl_estanterias';
    protected $fillable = ['codigo', 'nombre', 'tipo', 'zona', 'capacidad_maxima', 'descripcion', 'activa', 'orden'];

    // Relación con niveles
    public function niveles()
    {
        return $this->hasMany(BlNivelEstanteria::class, 'estanteria_id');
    }

    // Relación directa con posiciones (a través de niveles)
    public function posiciones()
    {
        return $this->hasManyThrough(BlPosicion::class, BlNivelEstanteria::class, 'estanteria_id', 'nivel_id');
    }

    // Relación con inventario detalle (a través de posiciones)
    public function inventarioDetalle()
    {
        return $this->hasManyThrough(BlInventarioDetalle::class, BlPosicion::class, 'nivel_id', 'posicion_id')
            ->via('niveles');
    }

    // Scope para estanterías activas
    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    // Método para contar productos en esta estantería
    public function getTotalProductosAttribute()
    {
        return $this->inventarioDetalle()->count();
    }

    // Método para contar unidades en esta estantería
    public function getTotalUnidadesAttribute()
    {
        return $this->inventarioDetalle()->sum('cantidad_actual');
    }
}