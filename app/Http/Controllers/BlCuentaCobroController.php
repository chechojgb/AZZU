<?php

namespace App\Http\Controllers;

use App\Models\BlCuentaCobro;
use App\Models\BlCuentaCobroItem;
use App\Models\BlMarcacion;
use App\Models\BlMarcaciones;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BlCuentaCobroController extends Controller
{
    public function index()
    {   
        // .producto
        $user = Auth::user();
        $cuentas = BlCuentaCobro::with(['itemsMarcacion.marcacion.pedido.items.empaque.producto', 'usuario'])->get();
        return Inertia::render('BLCuentaCobro', [
            'user' => $user,
            'cuentasCobro' => $cuentas,
        ]);
    }

    public function pasarPagados(Request $request)
    {
        $items = $request->input('items', []);
        if (empty($items)) {
            return back()->withErrors(['items' => 'No hay ítems seleccionados']);
        }
        $trabajadorId = $items[0]['user_id'];
        $total = collect($items)->sum('total');
        DB::transaction(function () use ($trabajadorId, $total, $items) {
            $cuenta = BlCuentaCobro::create([
                'user_id' => $trabajadorId,
                'fecha' => now(),
                'total' => $total,
            ]);
            foreach ($items as $item) {
                BlCuentaCobroItem::create([
                    'cuenta_cobro_id' => $cuenta->id,
                    'marcacion_id' => $item['marcacion_id'],
                ]);
                BlMarcaciones::where('id', $item['marcacion_id'])->update(['pagado' => 1]);
            }
        });
        return back()->with('success', 'Cuenta de cobro creada y items marcados como pagados.');
    }
}
