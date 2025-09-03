import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

const EditarProductForm = ({ productDetail, onSave, onCancel, onClose, colores }) => {
  console.log("editar:", productDetail);

  const [formData, setFormData] = useState({
    tipo_producto: productDetail.tipo_producto || "",
    tamanio: productDetail.tamanio || "",
    color_id: productDetail.color?.id || "", // guardamos id del color
  });

  const [descripcion, setDescripcion] = useState(productDetail.descripcion || "");

  useEffect(() => {
    // buscamos el color seleccionado dentro del array colores
    const colorSeleccionado = colores?.find(
      (c) => c.id === parseInt(formData.color_id)
    );

    // construimos la descripcion
    const nuevaDescripcion = `${formData.tipo_producto || ""} ${formData.tamanio || ""} ${colorSeleccionado?.codigo || ""}`.trim();
    setDescripcion(nuevaDescripcion);
  }, [formData.tipo_producto, formData.tamanio, formData.color_id, colores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // pasamos la descripcion calculada al guardar
    onSave({ ...formData, descripcion, id: productDetail.id });
  };

  const hasColors = colores && colores.length > 0;

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
          <ShoppingCartIcon className="w-16 h-16 text-indigo-500" />
        </div>
      </div>

      {/* Nombre en header */}
      <div className="text-center mt-2">
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          {descripcion || "Editar Producto"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Modifica los datos y guarda los cambios
        </p>
      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* Tipo de Producto */}
        <div>
          <Label htmlFor="tipo_producto" value="Tipo de Producto" />
          <Select
            id="tipo_producto"
            required
            value={formData.tipo_producto}
            onChange={(e) =>
              setFormData({ ...formData, tipo_producto: e.target.value })
            }
          >
            <option value="">Seleccione...</option>
            <option value="BT">Botón (BT)</option>
            <option value="OJ">Ojillo (OJ)</option>
            <option value="BR">Broche (BR)</option>
          </Select>
        </div>

        {/* Tamaño */}
        <div>
          <Label htmlFor="tamanio" value="Tamaño" />
          <TextInput
            id="tamanio"
            name="tamanio"
            value={formData.tamanio}
            onChange={handleChange}
            className="rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Color */}
        <div>
          <Label htmlFor="color_id" value="Color" />
          <Select
            id="color_id"
            required
            value={formData.color_id}
            onChange={(e) =>
              setFormData({ ...formData, color_id: e.target.value })
            }
          >
            <option value="">Seleccione...</option>
            {hasColors ? (
              colores.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.nombre} ({color.codigo})
                </option>
              ))
            ) : (
              <option value="" disabled>
                No hay colores disponibles
              </option>
            )}
          </Select>
        </div>
      </div>

      {/* Descripción automática */}
      <div>
        <Label htmlFor="descripcion" value="Descripción (automática)" />
        <TextInput
          id="descripcion"
          name="descripcion"
          value={descripcion}
          readOnly
          className="rounded-xl bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
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

export default EditarProductForm;
