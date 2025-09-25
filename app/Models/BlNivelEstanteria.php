<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlNivelEstanteria extends Model
{
    use HasFactory;

    protected $table = 'bl_niveles_estanteria';
    protected $fillable = ['estanteria_id', 'nivel', 'codigo', 'capacidad_maxima', 'orden', 'activo'];

    // Relación con estantería
    public function estanteria()
    {
        return $this->belongsTo(BlEstanteria::class, 'estanteria_id');
    }

    // Relación con posiciones
    public function posiciones()
    {
        return $this->hasMany(BlPosicion::class, 'nivel_id');
    }

    // Relación con inventario detalle (a través de posiciones)
    public function inventarioDetalle()
    {
        return $this->hasManyThrough(BlInventarioDetalle::class, BlPosicion::class, 'nivel_id', 'posicion_id');
    }

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}