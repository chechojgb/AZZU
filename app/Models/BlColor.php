<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\BlProducto;

class BlColor extends Model
{
    protected $table = 'bl_colores';
    protected $fillable = ['codigo', 'nombre'];

    // Relación: Un color puede estar en muchos productos
    public function productos(): HasMany
    {
        return $this->hasMany(BlProducto::class, 'color_id');
    }
}
