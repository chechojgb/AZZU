import { useState } from "react";

import axios from "axios";

const AreaModalContent = ({ onClose, setToast}) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setToast({ show: false, success: false, message: "" });

    try {
      const res = await axios.post("/areas.store", { name });
      setToast({
        show: true,
        success: true,
        message: res.data?.message || "Área creada correctamente.",
      });
      setName("");
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
        setToast({
          show: true,
          success: false,
          message: "Error al crear el área.",
        });
      }
    }

    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  return (
    <>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Crear nueva área
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

export default AreaModalContent;
