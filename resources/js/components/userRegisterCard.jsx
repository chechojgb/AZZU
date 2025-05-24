import React from "react";
import { UserRoundCheck, ClipboardList } from 'lucide-react';

export default function RegisterCard({form, supervisor}){
    return(
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 mb-4"></div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{form.name || 'Usuario'}</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>{form.email || 'Sin correo asignado'}</li>
                <li>{form.role || 'Sin rol'}</li>
                <li className="flex items-center gap-2 justify-center" ><ClipboardList/> Este usuario será creado con los permisos seleccionados.</li>
                {supervisor && (
                <li className="flex items-center gap-2 justify-center">
                    <UserRoundCheck className='text-lg font-semibold' />
                    <span>Aségurate de asignar al menos un área si el rol es Supervisor.</span>
                </li>
                )}
            </ul>
        </div>
    );
}