<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Area;
use App\Models\AreaRoleUser;


class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['areaRoles.role', 'areaRoles.area'])->get();

        return view('admin.users.index', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $areas = Area::all();
        $roles = Role::all();
        return view('admin.users.create', compact('areas', 'roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role' => 'required',
        ]);

        // Crear usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Buscar el rol por nombre
        $role = Role::where('name', $request->role)->first();

        // Verificar si es supervisor
        if ($role && $role->name === 'Supervisor') {
            // Preparar datos para mostrar antes de guardar
            $areasSeleccionadas = [];

            foreach ($request->areas ?? [] as $areaName) {
                $area = Area::where('name', $areaName)->first();
                if ($area) {
                    $areasSeleccionadas[] = [
                        'user_id' => $user->id,
                        'role_id' => $role->id,
                        'area_id' => $area->id,
                    ];
                }
            }
            foreach ($areasSeleccionadas as $relacion) {
                AreaRoleUser::create($relacion);
            }
        }

        if ($role && in_array($role->name, ['Admin', 'Soporte'])) {
            // Asignar todas las áreas
            $todasLasAreas = Area::all();
            foreach ($todasLasAreas as $area) {
                AreaRoleUser::create([
                    'user_id' => $user->id,
                    'role_id' => $role->id,
                    'area_id' => $area->id,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, $id)
    {
        $user = User::with(['areaRoles.role', 'areaRoles.area'])->find($id);

        if (!$user) {
            return redirect()->back()->with('error', 'Usuario no encontrado.');
        }

        $areas = Area::all();
        $userRole = optional($user->areaRoles->first())->role->name ?? null;

        return view('admin.users.show', compact('user', 'areas', 'userRole'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|string|exists:roles,name',
            'areas' => 'array',
            'areas.*' => 'integer|exists:areas,id',
        ]);
    
        // 1. Actualizar datos básicos
        $user->name = $request->name;
        $user->email = $request->email;
    
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
    
        $user->save();
    
        // 2. Obtener el rol por nombre
        $role = Role::where('name', $request->role)->firstOrFail();
    
        // 3. Eliminar asignaciones anteriores del usuario en area_role_users
        AreaRoleUser::where('user_id', $user->id)->delete();
    
        // 4. Determinar áreas a asignar
        $areas = [];
    
        if (in_array($role->name, ['Admin', 'Soporte'])) {
            $areas = Area::pluck('id')->toArray(); // Todas las áreas
        } elseif ($role->name === 'Supervisor') {
            $areas = $request->areas ?? [];
        }
    
        // 5. Crear las nuevas asignaciones
        foreach ($areas as $areaId) {
            AreaRoleUser::create([
                'user_id' => $user->id,
                'role_id' => $role->id,
                'area_id' => $areaId,
            ]);
        }
    
        return redirect()->route('users.index')->with('success', 'Usuario actualizado correctamente.');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
