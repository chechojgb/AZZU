import { useState } from "react";
import axios from "axios";

const SshSessionModalContent = ({ onClose, setToast }) => {
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: 22,
    username: "",
    password: "",
    private_key: "",
    use_private_key: false,
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setToast({ show: false, success: false, message: "" });

    try {
      const res = await axios.post("/terminal.store", form);
      setToast({
        show: true,
        success: true,
        message: res.data?.message || "Sesión SSH creada correctamente.",
      });
      onClose();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
        setToast({
          show: true,
          success: false,
          message: "Error al crear la sesión SSH.",
        });
      }
    }

    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Crear nueva sesión SSH
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Servidor de Producción"
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Host
            </label>
            <input
              name="host"
              value={form.host}
              onChange={handleChange}
              placeholder="192.168.1.1"
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.host && <p className="text-sm text-red-600 mt-1">{errors.host[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Puerto
            </label>
            <input
              name="port"
              type="number"
              value={form.port}
              onChange={handleChange}
              placeholder="22"
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.port && <p className="text-sm text-red-600 mt-1">{errors.port[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Usuario
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="root"
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username[0]}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña (opcional)
            </label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password[0]}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Clave privada (opcional)
            </label>
            <textarea
              name="private_key"
              value={form.private_key}
              onChange={handleChange}
              rows="4"
              placeholder="-----BEGIN PRIVATE KEY-----"
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
            {errors.private_key && <p className="text-sm text-red-600 mt-1">{errors.private_key[0]}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="use_private_key"
                checked={form.use_private_key}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Usar clave privada para autenticación
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              placeholder="Este servidor es el de staging..."
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description[0]}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Guardar sesión
          </button>
        </div>
      </form>
    </>
  );
};

export default SshSessionModalContent;
