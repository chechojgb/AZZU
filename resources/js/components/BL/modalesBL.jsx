import { useState, useEffect } from 'react';
import {
  TextInput,
  Select,
  Button,
  Label,
  Textarea,
} from 'flowbite-react';
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ModalPedidosBL({ onClose, onSave, clientes, productos, setToast  }) {

  
  const [formData, setFormData] = useState({
    cliente_id: '',
    fecha_acordada: '',
    nota: '',
    productos: [{ producto_id: '', cantidad: 1 }]
  });

  const [productosSeleccionados, setProductosSeleccionados] = useState([
    { producto_id: '', cantidad: 1 },
  ]);

  
  const handleProductoChange = (index, field, value) => {
    const nuevos = [...productosSeleccionados];
    
    // Si está cambiando el producto_id
    if (field === "producto_id") {
      nuevos[index][field] = value;

      const productoNuevo = productos.find(p => String(p.id) === String(value));
      const stockMaximo = productoNuevo?.stock_total ?? Infinity;

      // Si la cantidad actual es mayor que el nuevo stock, corregimos
      if (nuevos[index].cantidad > stockMaximo) {
        nuevos[index].cantidad = stockMaximo;

        setToast({
          show: true,
          success: false,
          message: `La cantidad fue ajustada al nuevo stock disponible (${stockMaximo})`,
        });
      }
    } else {
      nuevos[index][field] = value;
    }

    setProductosSeleccionados(nuevos);
  };

  const agregarProducto = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      { producto_id: '', cantidad: 1 },
    ]);
  };

  const eliminarProducto = (index) => {
    const nuevos = [...productosSeleccionados];
    nuevos.splice(index, 1);
    setProductosSeleccionados(nuevos);
  };

  const handleCantidadChange = (index, nuevaCantidad) => {
    setProductosSeleccionados((prev) => {
      return prev.map((prod, i) => {
        if (i === index) {
          const productoReal = productos.find(p => String(p.id) === String(prod.producto_id));
          const stockMaximo = productoReal?.stock_total ?? Infinity;

          if (nuevaCantidad > stockMaximo) {
            setToast({
              show: true,
              success: false,
              message:  `La cantidad supera el stock disponible (${stockMaximo})`
            });
            return { ...prod, cantidad: stockMaximo };
          }

          return { ...prod, cantidad: nuevaCantidad };
        }
        return prod;
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, productos: productosSeleccionados });
    onClose();
  };

  const clienteSeleccionado = clientes.find(
    (c) => String(c.id) === String(formData.cliente_id)
  );

  const productosResumen = productosSeleccionados.map((item) => {
    const prod = productos.find((p) => String(p.id) === String(item.producto_id));
    return prod ? `${prod.descripcion} (${item.cantidad})` : null;
  }).filter(Boolean);
  console.log('productos seleccionados:', productosResumen);

  return (
    <div className="max-h-[90vh] flex flex-col">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Nuevo Pedido</h2>
        <p className="text-gray-600 text-sm">Complete los detalles del pedido</p>
      </div>

      {/* Contenido del formulario */}
      <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cliente */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cliente *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.cliente_id}
              onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            {formData.cliente_id && (
              <p className="text-sm text-gray-500 mt-1">
                Seleccionado: <span className="font-medium text-gray-700">{clienteSeleccionado?.nombre}</span>
              </p>
            )}
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fecha de entrega *</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.fecha_acordada}
              onChange={(e) => setFormData({ ...formData, fecha_acordada: e.target.value })}
              required
            />
          </div>

          {/* Notas */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notas adicionales del pedido"
              rows={3}
              value={formData.nota}
              onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
            />
          </div>
        </div>

        {/* Sección de productos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Productos</h3>
            <button
              type="button"
              onClick={agregarProducto}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir producto
            </button>
          </div>

          <div className="space-y-3">
            {productosSeleccionados.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-md">
                {/* Producto */}
                <div className="md:col-span-6 space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Producto</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={item.producto_id}
                    onChange={(e) => handleProductoChange(index, 'producto_id', e.target.value)}
                    required
                  >
                    <option value="">Seleccione un producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cantidad */}
                <div className="md:col-span-6 space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Cantidad</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={productos.find(p => String(p.id) === String(item.producto_id))?.stock_total || 9999}
                      value={item.cantidad}
                      onChange={(e) => handleCantidadChange(index, parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {item.producto_id && (
                      <span className="absolute right-2 top-2 text-xs text-gray-500">
                        Stock: {productos.find(p => String(p.id) === String(item.producto_id))?.stock_total || 'N/A'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón Eliminar */}
                <div className="md:col-span-3 flex justify-end">
                  {productosSeleccionados.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarProducto(index)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2">Resumen del pedido</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Cliente</p>
              <p className="font-medium">{clienteSeleccionado?.nombre || 'Ninguno'}</p>
            </div>
            <div>
              <p className="text-gray-500">Fecha acordada</p>
              <p className="font-medium">{formData.fecha_acordada || 'Sin definir'}</p>
            </div>
            <div className="md:col-span-1">
              <p className="text-gray-500">Productos ({productosResumen.length})</p>
              <p className="font-medium truncate">
                {productosResumen.length > 0 ? productosResumen.join(', ') : 'Ninguno'}
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Pie de página con botones */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guardar Pedido
        </button>
      </div>
    </div>
  );
}



export function ModalAddClientesBL({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    ciudad: '',
    nit: '',
    direccion: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="max-w-2xl w-full  rounded shadow-lg flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto max-h-[75vh] p-6 space-y-6"
      >
        <h2 className="text-xl font-bold">Agregar Nuevo Cliente</h2>

        {/* Nombre */}
        <div>
          <Label htmlFor="nombre" value="Nombre del Cliente" />
          <TextInput
            id="nombre"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del Cliente"
          />
        </div>

        {/* Contacto y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contacto" value="Nombre del contacto" />
            <TextInput
              id="contacto"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              placeholder="contacto Ej: Juan Pérez"
            />
          </div>
          <div>
            <Label htmlFor="telefono" value="Teléfono" />
            <TextInput
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono Ej: 3001234567"
            />
          </div>
        </div>

        {/* Email y Ciudad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" value="Correo Electrónico" />
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo Electrónico"
            />
          </div>
          <div>
            <Label htmlFor="ciudad" value="Ciudad" />
            <Select
              id="ciudad"
              name="ciudad"
              required
              value={formData.ciudad}
              onChange={handleChange}
            >
              <option value="">Seleccione una ciudad</option>
              <option value="Bogotá">Bogotá</option>
              <option value="Medellín">Medellín</option>
              <option value="Cali">Cali</option>
              <option value="Barranquilla">Barranquilla</option>
            </Select>
          </div>
        </div>

        {/* NIT */}
        <div>
          <Label htmlFor="nit" value="NIT" />
          <TextInput
            id="nit"
            name="nit"
            value={formData.nit}
            onChange={handleChange}
            placeholder="NIT Ej: 123456789-0"
          />
        </div>

        {/* Dirección */}
        <div>
          <Label htmlFor="direccion" value="Dirección" />
          <Textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            rows={2}
            placeholder="Dirección Ej: Calle 123 #45-67, Local 5"
          />
        </div>
      <div className="flex justify-between p-4 border-t pt-6 sticky bottom-0">
        <Button color="gray" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" gradientMonochrome="blue" onClick={handleSubmit}>
          Guardar Cliente
        </Button>
      </div>
      </form>

      {/* Botones */}
    </div>
  );
}


export function ModalViewPedidosBL({ onClose, pedido }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
          Detalles del Pedido
        </h2>

        {/* Contenido del pedido */}
        <div className="mt-4 space-y-3">
          <p>
            <span className="font-semibold">ID:</span> {pedido.id}
          </p>
          <p>
            <span className="font-semibold">Cliente:</span>{" "}
            {pedido.cliente?.nombre}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span> {pedido.fecha_pedido}
          </p>
          <p>
            <span className="font-semibold">Estado:</span>{" "}
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                pedido.estado === "completado"
                  ? "bg-green-100 text-green-700"
                  : pedido.estado === "pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {pedido.estado}
            </span>
          </p>
        </div>

        {/* Lista de items */}
        {pedido.items && pedido.items.length > 0 && (
          <div className="mt-5">
            <h3 className="text-lg font-semibold mb-2">Productos</h3>
            <ul className="divide-y divide-gray-200">
              {pedido.items.map((item) => (
                <li key={item.id} className="py-2 flex justify-between text-sm">
                  <span>
                    {item.empaque?.producto?.nombre || "Producto sin nombre"}
                  </span>
                  <span className="text-gray-500">
                    x{item.cantidad_empaques}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botón Cerrar inferior */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
