import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import PrevTable from '@/components/prevTable';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";

const breadcrumbs = [
    {
        title: 'Usuarios activos',
        href: '/users',
    },
];

export default function UsersCreate({ totalUsers = 42, activeSupervisors = 10, lastLogin = 'hace 2h' }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Título principal */}
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 border border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crea y administra los usuarios del sistema desde aquí.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Formulario */}
          <div className="md:col-span-2 border border-sidebar-border/70 dark:border-sidebar-border rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Registro de Usuario</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</label>
                <input type="text" className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
                <input type="email" className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                <input type="password" className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar contraseña</label>
                <input type="password" className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de usuario</label>
                <select className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 text-gray-900 dark:text-white">
                  <option>Seleccione un tipo</option>
                  <option>Administrador</option>
                  <option>Soporte</option>
                  <option>Supervisor</option>
                </select>
              </div>

              <button type="submit" className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition">
                Guardar usuario
              </button>
            </form>
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">
            <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-xl bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tipos de usuario</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Los usuarios pueden ser administradores, soporte o supervisores. Cada uno tiene diferentes permisos.
              </p>
            </div>

            <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-xl bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Consejo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Recuerda asignar correctamente el tipo de usuario para evitar errores en el sistema.
              </p>
            </div>

            <div className="border border-sidebar-border/70 dark:border-sidebar-border rounded-xl bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estadísticas</h3>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>👥 {totalUsers} usuarios registrados</li>
                <li>🛠 {activeSupervisors} supervisores activos</li>
                <li>⏰ Último ingreso: {lastLogin}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

              


                
            </div>
        </AppLayout>
    );
}
