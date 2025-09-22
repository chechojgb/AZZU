<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlCuentaCobro extends Model
{
    protected $table = 'bl_cuentas_cobro';
    protected $fillable = ['user_id', 'fecha', 'total'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(BlCuentaCobroItem::class, 'cuenta_cobro_id');
    }
}