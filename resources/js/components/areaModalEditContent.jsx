import { useState, useEffect } from "react";
import axios from "axios";

const AreaModalEditContent = ({ onClose, setToast, area }) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔄 Traer el área desde la API cuando cambie el área seleccionada
  useEffect(() => {
    if (!area) return;

    axios.get(`/areas/${area}/show`)
      .then((res) => {
        setName(res.data.name);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el área:", err);
        setToast({
          show: true,
          success: false,
          message: "Error al cargar el área.",
        });
        onClose();
      });
  }, [area]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setToast({ show: false, success: false, message: "" });

    try {
      const res = await axios.put(`/areas/${area}/edit`, { name });
      setToast({
        show: true,
        success: true,
        message: res.data?.message || "Área actualizada correctamente.",
      });
      onClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        setToast({
          show: true,
          success: false,
          message: "Error al actualizar el área.",
        });
      }
    }

    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  console.log('nombre:',area);
  

  if (loading) {
    return <p className="p-4">Cargando datos del área...</p>;
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Editar área
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre del área
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 rounded-md p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ej: Soporte, Ventas..."
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>}
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
            Guardar área
          </button>
        </div>
      </form>
    </>
  );
};

export default AreaModalEditContent;
