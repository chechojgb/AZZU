<?php

namespace App\Http\Controllers;

use App\Models\BlEmpaque;
use App\Models\BlMovimiento;
use Illuminate\Http\Request;

class BlMovimientoController extends Controller
{
    // Registrar movimiento (entrada/salida)
    public function store(Request $request)
    {
        $request->validate([
            'empaque_id' => 'required|exists:bl_empaques,id',
            'tipo' => 'required|in:entrada,salida,ajuste',
            'cantidad' => 'required|integer|min:1',
            'motivo' => 'nullable|string',
            'lote' => 'nullable|string',
        ]);

        BlMovimiento::create($request->all());

        return redirect()->back()->with('success', 'Movimiento registrado!');
    }
}