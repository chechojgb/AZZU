<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use PhpParser\Node\Arg;
use Inertia\Inertia;

class AreaController extends Controller
{
    public function index()
    {
        // Contar cuántas áreas existen en total
        $totalAreas = \App\Models\Area::count();

        $areas = Area::all();
        // dd($areas);
        // Formatear cada usuario
        // $result = $users->map(function ($user) {
        //     $roles = $user->areaRoles->pluck('role.name')->unique()->values();
        //     $areas = $user->areaRoles->pluck('area.name')->unique()->values();

        //     return [
        //         'id' => $user->id,
        //         'name' => $user->name,
        //         'email' => $user->email,
        //         'rol' => $roles->first(),
        //         'areas' => $areas, 
        //     ];
        // });

        // Incluir el total de áreas global
        return response()->json([
            'areas' => $areas,
            'totalAreas' => $totalAreas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    // $roles = \App\Models\Role::select('name')->get();
    // $areas = \App\Models\Area::select('name')->get();

    // Log::info('📦 Roles y Áreas cargadas:', [
    //     'roles' => $roles->pluck('name'),
    //     'areas' => $areas->pluck('name'),
    // ]);

    // return response()->json([
    //     'roles' => $roles,
    //     'areas' => $areas,
    // ]);
    // }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        // Crear usuario
        $area = Area::create([
            'name' => $request->name,
        ]);

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Area creada correctamente: ' . $area->name . '.']);
        } else {
            return redirect()->back()->with('success', 'Area creada correctamente: ' . $area->name . '.' );
        }
    }

    // /**
    //  * Display the specified resource.
    //  */
    public function show($id)
    {
        return Area::findOrFail($id);
    }
    // /**
    //  * Show the form for editing the specified resource.
    //  */
    public function edit($id)
    {
        $area = Area::findOrFail($id);
        // $areas = Area::all();
        // $userRole = optional(optional($user->areaRoles->first())->role)->name;
        // $checkedAreas = $user->areaRoles->pluck('area_id')->toArray();

        return Inertia::render('areas/edit', [
            'areas' => $area,
            // 'areas' => $areas,
        ]);
    }

    // /**
    //  * Update the specified resource in storage.
    //  */
    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $area = Area::findOrFail($id);
        $area->name = $request->name;
        $area->save();

        return response()->json(['message' => 'Área actualizada correctamente.']);
    }
    

    // /**
    //  * Remove the specified resource from storage.
    //  */
    // public function destroy(User $user)
    // {
    //     //
    // }

    // public function data()
    // {
    //     $user = Auth::user();

    //     if ($user) {
    //         // Ensure $user is an Eloquent model instance
    //         $user = User::with('areaRoles.area')->find($user->id);

    //         $operations = $user->areaRoles->map(fn($ar) => $ar->area->name)
    //                                     ->unique()
    //                                     ->values();

    //         return response()->json([
    //             'id' => $user->id,
    //             'name' => $user->name,
    //             'email' => $user->email,
    //             'operations' => $operations,
    //         ]);
    //     } else {
    //         return response()->json(['error' => 'No authenticated user.'], 401);
    //     }
    // }
}
