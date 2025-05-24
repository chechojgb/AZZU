import React from "react";
import { useState, useEffect } from "react";
// import FromCreate from '@/components/formCreate';
import { HiInformationCircle } from 'react-icons/hi';
import axios from 'axios';

export default function FromCreate({submit, form, change, errors, isSupervisor}){
    const [roles, setRoles] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        axios.get('/users/creates') // Endpoint que devuelve roles y áreas
        .then(res => {
            setRoles(res.data.roles || []);
            setAreas(res.data.areas || []);
        })
        .catch(err => {
            console.error('Error al cargar roles/áreas:', err);
        });
    }, []);
    return(
        <form className="space-y-4" onSubmit={submit}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Registrar usuario</h2>
            <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                name="name"
                value={form.name}
                onChange={change}
                className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Correo</label>
                <input
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium flex items-center gap-1">
                Contraseña <HiInformationCircle className="h-4 w-4 text-gray-400" />
                </label>
                <input
                name="password"
                type="password"
                value={form.password}
                onChange={change}
                className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Confirmar contraseña</label>
                <input
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={change}
                className={`w-full mt-1 rounded-md p-2 border ${
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.password_confirmation && (
                <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">Rol</label>
                <select
                name="role"
                value={form.role}
                onChange={change}
                className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                <option value="">Seleccione un rol</option>
                {roles.map(role => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                ))}
                </select>
                {errors.role && <p className="text-sm text-red-600">{errors.role[0]}</p>}
            </div>

            {isSupervisor && (
                <div >
                <label className="block text-sm font-medium mb-1">Áreas del supervisor</label>
                <div className="flex gap-4 text-sm text-gray-800 dark:text-gray-200">
                    {areas.map(area => (
                    <div key={area.name} className="flex items-center gap-2">
                        <input
                        type="checkbox"
                        name="areas"
                        value={area.name}
                        id={area.name}
                        checked={form.areas.includes(area.name)}
                        onChange={change}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor={area.name}>{area.name}</label>
                    </div>
                    ))}
                </div>
                </div>
            )}

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">
                Guardar usuario
            </button>
        </form>
    );
}