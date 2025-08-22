import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const EditarClienteForm = ({ clienteDetails, onSave, onCancel, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: clienteDetails.nombre || "",
    nit: clienteDetails.nit || "",
    contacto: clienteDetails.contacto || "",
    email: clienteDetails.email || "",
    telefono: clienteDetails.telefono || "",
    ciudad: clienteDetails.ciudad || "",
    direccion: clienteDetails.direccion || "",
    id: clienteDetails.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
    >
      {/* Encabezado con gradiente */}
      <div className=" inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl" />

      {/* Avatar */}
      <div className="relative flex justify-center -mt-10">
        <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center ring-4 ring-white dark:ring-gray-900">
          <UserCircleIcon className="w-16 h-16 text-indigo-500" />
        </div>
      </div>

      {/* Nombre en header */}
      <div className="text-center mt-2">
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          {formData.nombre || "Editar Cliente"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Modifica los datos y guarda los cambios
        </p>
      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* Nombre */}
        <div>
          <Label htmlFor="nombre" value="Nombre" />
          <TextInput
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* NIT */}
        <div>
          <Label htmlFor="nit" value="NIT" />
          <TextInput
            id="nit"
            name="nit"
            value={formData.nit}
            onChange={handleChange}
            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Contacto */}
        <div>
          <Label htmlFor="contacto" value="Contacto" />
          <TextInput
            id="contacto"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Teléfono */}
        <div>
          <Label htmlFor="telefono" value="Teléfono" />
          <TextInput
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Ciudad */}
        <div>
          <Label htmlFor="ciudad" value="Ciudad" />
          <TextInput
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Dirección */}
      <div>
        <Label htmlFor="direccion" value="Dirección" />
        <TextInput
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="rounded-xl focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          color="light"
          onClick={onClose}
          type="button"
          className="rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          Cancelar
        </Button>
        <Button
          color="purple"
          type="submit"
          className="rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

export default EditarClienteForm;
