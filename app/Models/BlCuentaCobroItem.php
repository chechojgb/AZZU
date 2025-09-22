<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlCuentaCobroItem extends Model
{
    protected $fillable = ['cuenta_cobro_id', 'marcacion_id'];

    public function cuenta()
    {
        return $this->belongsTo(BlCuentaCobro::class, 'cuenta_cobro_id');
    }

    public function marcacion()
    {
        return $this->belongsTo(BlMarcacion::class, 'marcacion_id');
    }
}