import React from "react";


function UserInfoList ({data}){
    const totalUsuarios = (data || []).length;
    const ultimoUsuario = (data && data.length > 0) ? data[data.length - 1] : null;

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="border relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 p-4">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300">Total de areas</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalUsuarios}</p>
          </div>

          <div className="border relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 p-4">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300">Última area creada</h4>
            <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
              {ultimoUsuario?.name || 'N/A'} <br/> {ultimoUsuario?.email}
            </p>
          </div>

          <div className="border relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 p-4">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300">Areas activas</h4>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {totalUsuarios} 
            </p>
          </div>
        </div>
        

    );
}

export default UserInfoList