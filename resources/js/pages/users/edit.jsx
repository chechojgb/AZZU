import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';

const breadcrumbs = [
  { title: 'Editar usuario', href: '/users' },
];

export default function Edit({ user, areas }) {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    role: user.role,
    areas: user.checkedAreas,
  });

  const [toast, setToast] = useState({
    show: false,
    success: true,
    message: '',
  });

  const handleCheckbox = (areaId) => {
    setData('areas', data.areas.includes(areaId)
      ? data.areas.filter(id => id !== areaId)
      : [...data.areas, areaId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('users.update', user.id), {
      preserveScroll: true,
      onSuccess: (page) => {
        setToast({
          show: true,
          success: true,
          message: page.props.flash?.success || 'Usuario actualizado correctamente.',
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
      },
      onError: () => {
        setToast({
          show: true,
          success: false,
          message: 'Ocurrió un error al actualizar el usuario.',
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
      },
    });
  };

  const isSupervisor = data.role === 'Supervisor';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      {/* ✅ TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                toast.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
              }`}
            >
              {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
          </Toast>
        </div>
      )}

      {/* 🧾 FORMULARIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-white dark:bg-gray-800 text-black dark:text-gray-200 min-h-screen">
        <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold mb-6">👤 Editar Usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-md bg-gray-100 border-gray-300 text-black dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Correo</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full rounded-md bg-gray-100 border-gray-300 text-black dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Rol</label>
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                className="w-full rounded-md bg-gray-100 border-gray-300 text-black dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
              >
                <option value="">Seleccione un rol</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Soporte">Soporte</option>
              </select>
            </div>

            {isSupervisor && (
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-2">Áreas del Supervisor</label>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.areas.includes(area.id)}
                        onChange={() => handleCheckbox(area.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label>{area.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 font-semibold text-white rounded shadow dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Actualizar usuario
              </button>
            </div>
          </form>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl text-white">
            <h3 className="text-lg font-semibold">📌 Nota rápida</h3>
            <p className="text-sm">Solo se permite cambiar entre los roles Soporte y Supervisor. Los administradores no se pueden editar desde aquí.</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl border dark:bg-gray-700 dark:border-gray-600">
            <h3 className="text-lg font-semibold">👤 Información del usuario</h3>
            <ul className="text-sm mt-2 dark:text-gray-400">
              <li><strong>Nombre:</strong> {user.name}</li>
              <li><strong>Correo:</strong> {user.email}</li>
              <li><strong>Rol actual:</strong> {user?.role || 'Sin rol'}</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl border dark:bg-gray-700 dark:border-gray-600">
            <h3 className="text-lg font-semibold">👀 Áreas actuales</h3>
            <ul className="text-sm mt-2 dark:text-gray-400">
              {user.checkedAreas.length > 0
                ? user.checkedAreas.map((id) => {
                    const area = areas.find((a) => a.id === id);
                    return <li key={id}>{area?.name ?? 'Área desconocida'}</li>;
                  })
                : <li>Sin áreas</li>}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
