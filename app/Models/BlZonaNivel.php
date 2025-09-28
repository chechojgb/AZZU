<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlZonaNivel extends Model
{
    use HasFactory;

    protected $table = 'bl_zonas_nivel';
    protected $fillable = [
        'nivel_id',
        'zona',
        'codigo_completo',
        'capacidad_maxima',
        'productos_actuales',
        'descripcion',
        'activa'
    ];

    // Relación con nivel
    public function nivel()
    {
        return $this->belongsTo(BlNivelEstanteria::class, 'nivel_id');
    }

    // Relación con inventario detalle
    public function inventarioDetalle()
    {
        return $this->hasMany(BlInventarioDetalle::class, 'zona_id');
    }

    // Relación con estantería (a través de nivel)
    public function estanteria()
    {
        return $this->hasOneThrough(
            BlEstanteria::class,
            BlNivelEstanteria::class,
            'id', // Foreign key on bl_niveles_estanteria
            'id', // Foreign key on bl_estanterias
            'nivel_id', // Local key on bl_zonas_nivel
            'estanteria_id' // Local key on bl_niveles_estanteria
        );
    }

    // Scope para zonas activas
    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    // Scope para zonas con capacidad disponible
    public function scopeConCapacidad($query, $cantidad = 1)
    {
        return $query->whereRaw('(capacidad_maxima - productos_actuales) >= ?', [$cantidad]);
    }

    // Método para calcular espacio disponible
    public function getEspacioDisponibleAttribute()
    {
        return $this->capacidad_maxima - $this->productos_actuales;
    }
}