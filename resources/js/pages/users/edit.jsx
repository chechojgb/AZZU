import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Toast, Button, TextInput, Label, Checkbox } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';
import { ClipboardCopy, SquareUserRound, Eye } from 'lucide-react';

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

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              toast.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
            }`}>
              {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
          </Toast>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-8 px-8 py-8 text-black dark:text-gray-200">
        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-600 w-full h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Editar Usuario
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="name" value="Nombre" />
              <TextInput
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                color={errors.name && 'failure'}
                helperText={errors.name && <span className="text-red-500">{errors.name}</span>}
                shadow
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="email" value="Correo" />
              <TextInput
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                color={errors.email && 'failure'}
                helperText={errors.email && <span className="text-red-500">{errors.email}</span>}
                shadow
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="role" value="Rol" />
              <select
                id="role"
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                className="w-full rounded-md bg-gray-50 border-gray-300 text-black dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 p-2"
              >
                <option value="">Seleccione un rol</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Soporte">Soporte</option>
              </select>
            </div>

            {isSupervisor && (
              <div className="col-span-2 border-t border-gray-300 dark:border-gray-600 pt-4">
                <Label value="Áreas del Supervisor" />
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`area-${area.id}`}
                        checked={data.areas.includes(area.id)}
                        onChange={() => handleCheckbox(area.id)}
                      />
                      <Label htmlFor={`area-${area.id}`}>{area.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="col-span-2 text-right mt-4">
              <Button type="submit" isProcessing={processing}>
                Actualizar usuario
              </Button>
            </div>
          </form>

        </div>

        {/* Panel lateral */}
        
        {/* Panel lateral con estilo unificado y sobrio */}
        <div className="space-y-6">
          {/* Nota rápida */}
          <div className="p-5 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 flex items-center gap-2">
              <ClipboardCopy /> Nota rápida
            </h3>
            <p className="text-sm leading-relaxed">
              Solo se permite cambiar entre los roles <strong>Soporte</strong> y <strong>Supervisor</strong>. 
              Los administradores no   se pueden editar desde aquí.
            </p>
          </div>

          {/* Información del usuario */}
          <div className="p-5 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 flex items-center gap-2">
              <SquareUserRound/> Información del usuario
            </h3>
            <ul className="text-sm space-y-2">
              <li><strong>Nombre:</strong> {user.name}</li>
              <li><strong>Correo:</strong> {user.email}</li>
              <li><strong>Rol actual:</strong> {user?.role || 'Sin rol'}</li>
            </ul>
          </div>

          {/* Áreas actuales */}
          <div className="p-5 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 flex items-center gap-2">
              <Eye/> Áreas actuales
            </h3>
            <ul className="text-sm space-y-1">
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
