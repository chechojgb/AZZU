import { useState, useEffect } from 'react';
import {
  TextInput,
  Select,
  Button,
  Label,
  Textarea,
} from 'flowbite-react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

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
    // onClose();
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
  <div className="max-h-[90vh] flex flex-col animate-fadeIn">
    
    {/* Encabezado */}
    <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Nuevo Pedido</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">Complete los detalles del pedido</p>
    </header>

    {/* Formulario */}
    <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">

      {/* Datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Cliente */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cliente *</label>
          <select
            value={formData.cliente_id}
            onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {formData.cliente_id && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Seleccionado:{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {clienteSeleccionado?.nombre}
              </span>
            </p>
          )}
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de entrega *</label>
          <input
            type="date"
            value={formData.fecha_acordada}
            onChange={(e) => setFormData({ ...formData, fecha_acordada: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Notas */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
          <textarea
            rows={3}
            placeholder="Notas adicionales del pedido"
            value={formData.nota}
            onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sección Productos */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Productos</h3>
          <button
            type="button"
            onClick={agregarProducto}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 
                       rounded shadow-sm hover:bg-blue-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Añadir producto
          </button>
        </div>

        <div className="space-y-3">
          {productosSeleccionados.map((item, index) => {
            const producto = productos.find(p => String(p.id) === String(item.producto_id));
            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-md border 
                           border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                {/* Producto */}
                <div className="md:col-span-6 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Producto</label>
                  <select
                    value={item.producto_id}
                    onChange={(e) => handleProductoChange(index, 'producto_id', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                               bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione un producto</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>{p.descripcion}</option>
                    ))}
                  </select>
                </div>

                {/* Cantidad */}
                <div className="md:col-span-6 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Cantidad</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={producto?.stock_total || 9999}
                      value={item.cantidad}
                      onChange={(e) => handleCantidadChange(index, parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                                 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {item.producto_id && (
                      <span className="absolute right-2 top-2 text-xs text-gray-500 dark:text-gray-400">
                        Stock: {producto?.stock_total || 'N/A'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón eliminar */}
                {productosSeleccionados.length > 1 && (
                  <div className="col-span-full flex justify-end">
                    <button
                      type="button"
                      onClick={() => eliminarProducto(index)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md 
                                 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-700/20 
                                 hover:bg-red-200 dark:hover:bg-red-700/30 
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Resumen */}
      <div className="p-4 rounded-lg border border-blue-100 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">Resumen del pedido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Cliente</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {clienteSeleccionado?.nombre || 'Ninguno'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Fecha acordada</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {formData.fecha_acordada || 'Sin definir'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Productos ({productosResumen.length})</p>
            <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
              {productosResumen.length > 0 ? productosResumen.join(', ') : 'Ninguno'}
            </p>
          </div>
        </div>
      </div>
    </form>

    {/* Pie de página */}
    <footer className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-2xl flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                   text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 
                   hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500"
      >
        Cancelar
      </button>
      <button
        type="submit"
        onClick={handleSubmit}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm 
                   bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-green-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Guardar Pedido
      </button>
    </footer>
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
        <Button type="submit" gradientmonochrome="blue" onClick={handleSubmit}>
          Guardar Cliente
        </Button>
      </div>
      </form>

      {/* Botones */}
    </div>
  );
}


export function ModalViewPedidosBL({ onClose, pedido }) {
  function InfoRow({ label, value }) {
    return (
      <div className="flex justify-between items-start gap-4 py-1">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm text-gray-800 dark:text-gray-100 break-words">
          {value ?? <span className="text-gray-400">—</span>}
        </span>
      </div>
    );
  }

  InfoRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.number]),
  };
  console.log(pedido);
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm "
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
          Detalles del Pedido
        </h2>

        {/* Información general */}
        <div className="mt-4 grid gap-3">
          <InfoRow label="ID" value={pedido.id} />
          <InfoRow label="Creado por" value={pedido?.usuario_creador?.name} />
          <InfoRow label="Cliente" value={pedido.cliente?.nombre} />
          <InfoRow label="Contacto" value={pedido.cliente?.contacto} />
          <InfoRow label="Teléfono" value={pedido.cliente?.telefono} />
          <InfoRow label="Fecha de entrega" value={pedido.fecha_pedido} />
          <InfoRow label="Notas del pedido" value={pedido.notas || "Sin notas"} />

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Estado:</span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
                pedido.estado === "entregado"
                  ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400"
                  : pedido.estado === "pendiente"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-400"
              }`}
            >
              {pedido.estado}
            </span>
          </div>
        </div>

        {/* Lista de productos */}
        {pedido.items && pedido.items.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Productos
            </h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {pedido.items.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {item.empaque?.producto?.descripcion || "Producto sin nombre"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Código: {item.empaque?.codigo_unico}
                    </p>
                    {item?.nota && (
                      <p className="text-xs text-gray-400 italic">{item.nota}</p>
                    )}
                  </div>
                  <span className="text-gray-500 mt-1 sm:mt-0">
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
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

  );
}


