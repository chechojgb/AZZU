<?php

// app/Http/Controllers/BlEmpaqueController.php
namespace App\Http\Controllers;

use App\Models\BlProducto;
use App\Models\BlEmpaque;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlEmpaqueController extends Controller
{
    // Registrar un nuevo empaque
    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:bl_productos,id',
            'codigo_unico' => 'required|string|unique:bl_empaques',
            'cantidad_por_empaque' => 'required|integer|min:1',
            'codigo_barras' => 'nullable|string',
        ]);

        BlEmpaque::create($request->all());

        return redirect()->back()->with('success', 'Empaque registrado!');
    }
}