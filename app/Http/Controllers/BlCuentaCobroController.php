<?php

namespace App\Http\Controllers;

use App\Models\BlCuentaCobro;
use App\Models\BlCuentaCobroItem;
use App\Models\BLMarcacion;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class BlCuentaCobroController extends Controller
{
    public function pasarPagados(Request $request)
    {
        $items = $request->input('items', []);
        if (empty($items)) {
            return back()->withErrors(['items' => 'No hay ítems seleccionados']);
        }
        $trabajadorId = $items[0]['user_id'];
        $total = collect($items)->sum('total');
        DB::transaction(function () use ($trabajadorId, $total, $items) {
            $cuenta = BLCuentaCobro::create([
                'user_id' => $trabajadorId,
                'fecha' => now(),
                'total' => $total,
            ]);
            foreach ($items as $item) {
                BLCuentaCobroItem::create([
                    'cuenta_cobro_id' => $cuenta->id,
                    'marcacion_id' => $item['marcacion_id'],
                ]);
                BLMarcacion::where('id', $item['marcacion_id'])->update(['pagado' => 1]);
            }
        });
        return back()->with('success', 'Cuenta de cobro creada y items marcados como pagados.');
    }
    // public function update($items)
    // {
    //     foreach ($items as $item) {
    //         $registro = BLMarcacion::findOrFail($item['marcacion_id']);
    //         $registro->validate([
    //             'marcacion_id' => 'required|integer|min:1'
    //         ]);
    //         $registro->update(['pagado' => 1]);
    //     }
    // }
}
