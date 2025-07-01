import { useState, useEffect } from "react";
import axios from "axios";

const TerminalModalEditContent = ({ onClose, setToast, terminal }) => {
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: 22,
    username: "",
    password: "",
    use_private_key: false,
    private_key: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!terminal) return;

    axios.get(`/terminal/${terminal}/show`)
      .then((res) => {
        setForm({
          name: res.data.name || "",
          host: res.data.host || "",
          port: res.data.port || 22,
          username: res.data.username || "",
          password: res.data.password || "",
          use_private_key: !!res.data.use_private_key,
          private_key: res.data.private_key || "",
          description: res.data.description || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar la terminal:", err);
        setToast({
          show: true,
          success: false,
          message: "Error al cargar el terminal.",
        });
        onClose();
      });
  }, [terminal]);

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
      const res = await axios.put(`/terminal/${terminal}/edit`, form);
      setToast({
        show: true,
        success: true,
        message: res.data?.message || "Terminal actualizada correctamente.",
      });
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        setToast({
          show: true,
          success: false,
          message: "Error al actualizar la Terminal.",
        });
      }
    }

    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  if (loading) {
    return <p className="p-4">Cargando datos de la terminal...</p>;
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Editar Terminal
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Nombre", name: "name", type: "text" },
          { label: "Host", name: "host", type: "text" },
          { label: "Puerto", name: "port", type: "number" },
          { label: "Usuario", name: "username", type: "text" },
          { label: "Contraseña", name: "password", type: "password" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors[name] && (
              <p className="text-sm text-red-600 mt-1">{errors[name][0]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="use_private_key"
              checked={form.use_private_key}
              onChange={handleChange}
            />
            Usar clave privada
          </label>
        </div>

        {form.use_private_key && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Clave privada (PEM)
            </label>
            <textarea
              name="private_key"
              value={form.private_key}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="-----BEGIN RSA PRIVATE KEY----- ..."
            />
            {errors.private_key && (
              <p className="text-sm text-red-600 mt-1">{errors.private_key[0]}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description[0]}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
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
            Guardar cambios
          </button>
        </div>
      </form>
    </>
  );
};

export default TerminalModalEditContent;
