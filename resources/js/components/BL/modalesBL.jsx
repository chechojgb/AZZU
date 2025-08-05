import { useState, useEffect } from 'react';
import {
  TextInput,
  Select,
  Button,
  Label,
  Textarea,
} from 'flowbite-react';

export default function ModalPedidosBL({ onClose, onSave, clientes, productos, setToast  }) {

  
  const [formData, setFormData] = useState({
    cliente_id: '',
    fecha_acordada: '',
    nota: '',
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
    <div className="max-w-2xl relative  rounded shadow flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto max-h-[75vh] p-4 space-y-6"
      >
        <h2 className="text-xl font-bold">Agregar Nuevo Pedido</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cliente_id" value="Cliente" />
            <Select
              id="cliente_id"
              required
              value={formData.cliente_id}
              onChange={(e) =>
                setFormData({ ...formData, cliente_id: e.target.value })
              }
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </Select>

            {formData.cliente_id && (
              <p className="text-sm  mt-1">
                Cliente seleccionado:{' '}
                <span className="font-medium ">
                  {clienteSeleccionado?.nombre}
                </span>
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fecha_acordada" value="Fecha de entrega acordada" />
            <TextInput
              type="date"
              id="fecha_acordada"
              required
              value={formData.fecha_acordada}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fecha_acordada: e.target.value,
                })
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="nota" value="Notas" />
            <Textarea
              id="nota"
              placeholder="Notas adicionales del pedido"
              value={formData.nota}
              rows={3}
              onChange={(e) =>
                setFormData({ ...formData, nota: e.target.value })
              }
            />
          </div>
        </div>

        {/* Productos */}
        <div className="space-y-4">
          <Label value="Productos del pedido" className="font-semibold" />
          {productosSeleccionados.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
            >
              <div>
                <Label value="Producto" />
                <Select
                  required
                  value={item.producto_id}
                  onChange={(e) =>
                    handleProductoChange(
                      index,
                      'producto_id',
                      e.target.value
                    )
                  }
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.descripcion}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label value="Cantidad" />
                  <input
                    type="number"
                    min="1"
                    max={
                      productos.find((p) => String(p.id) === String(item.producto_id))?.stock_total || 9999
                    }
                    value={item.cantidad}
                    onChange={(e) =>
                      handleCantidadChange(index, parseInt(e.target.value, 10))
                    }
                  />
              </div>

              <div className="flex justify-end">
                {productosSeleccionados.length > 1 && (
                  <Button
                    color="failure"
                    type="button"
                    onClick={() => eliminarProducto(index)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button color="blue" type="button" onClick={agregarProducto}>
            Agregar producto
          </Button>
        </div>

        {/* Resumen */}
        <div className="p-4 rounded border border-gray-200 space-y-2">
          <h3 className="font-semibold ">Resumen del pedido:</h3>
          <p>
            <span className="font-medium">Cliente:</span>{' '}
            {clienteSeleccionado?.nombre || 'Ninguno'}
          </p>
          <p>
            <span className="font-medium">Fecha acordada:</span>{' '}
            {formData.fecha_acordada || 'Sin definir'}
          </p>
          <p>
            <span className="font-medium">Productos:</span>{' '}
            {productosResumen.length > 0
              ? productosResumen.join(', ')
              : 'Ninguno'}
          </p>
        </div>
      </form>

      {/* Botones */}
      <div className="flex justify-between p-6 border-t sticky bottom-0 z-10 ">
        <Button color="gray" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" color="success" onClick={handleSubmit}>
          Guardar Pedido
        </Button>
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