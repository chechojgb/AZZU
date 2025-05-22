import { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [{ title: 'Usuarios activos', href: '/users' }];

export default function UsersCreate() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    areas: [],
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
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

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'areas') {
      const updatedAreas = checked
        ? [...form.areas, value]
        : form.areas.filter((a) => a !== value);
      setForm((prev) => ({ ...prev, areas: updatedAreas }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    axios.post('/users.store', form)
      .then((res) => {
        setSuccess(res.data.message || 'Usuario creado correctamente.');
        setForm({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: '',
          areas: [],
        });
      })
      .catch((err) => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  const isSupervisor = form.role === 'Supervisor';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-4 p-4">
        {/* Título principal */}
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 border shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crea y administra los usuarios del sistema desde aquí.</p>
        </div>

        {/* Formulario */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow border">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Registrar Usuario</h1>

          {success && <div className="mb-4 text-green-600">{success}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="w-full mt-1 rounded-md p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full mt-1 rounded-md p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              {errors.email && <p className="text-sm text-red-600">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className="w-full mt-1 rounded-md p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              {errors.password && <p className="text-sm text-red-600">{errors.password[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar contraseña</label>
              <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange}
                className="w-full mt-1 rounded-md p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de usuario</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full mt-1 rounded-md p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="">Seleccione un tipo</option>
                {roles.map(role => (
                  <option key={role.name} value={role.name}>{role.name}</option>
                ))}
              </select>
              {errors.role && <p className="text-sm text-red-600">{errors.role[0]}</p>}
            </div>

            {isSupervisor && (
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Áreas del supervisor</label>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {areas.map(area => (
                    <div key={area.name}>
                      <input type="checkbox" name="areas" value={area.name} id={area.name}
                        checked={form.areas.includes(area.name)} onChange={handleChange} />
                      <label htmlFor={area.name} className="ml-2">{area.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow">
              Guardar usuario
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
