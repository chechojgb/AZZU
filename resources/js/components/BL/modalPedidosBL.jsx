import { useState, useEffect } from 'react';
import {
  TextInput,
  Select,
  Button,
  Label,
  Textarea,
} from 'flowbite-react';

export default function ModalPedidosBL({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    cliente_id: '',
    fecha_acordada: '',
    nota: '',
  });

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([
    { producto_id: '', cantidad: 1 },
  ]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  useEffect(() => {
    // Simula carga de clientes desde BD
    setClientes([
      { id: 1, nombre: 'Cliente A' },
      { id: 2, nombre: 'Cliente B' },
      { id: 3, nombre: 'Cliente C' },
    ]);

    // Simula carga de productos desde BD
    setProductosDisponibles([
      { id: 1, nombre: 'Botón A' },
      { id: 2, nombre: 'Botón B' },
      { id: 3, nombre: 'Botón C' },
    ]);
  }, []);

  const handleProductoChange = (index, field, value) => {
    const nuevos = [...productos];
    nuevos[index][field] = value;
    setProductos(nuevos);
  };

  const agregarProducto = () => {
    setProductos([...productos, { producto_id: '', cantidad: 1 }]);
  };

  const eliminarProducto = (index) => {
    const nuevos = [...productos];
    nuevos.splice(index, 1);
    setProductos(nuevos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, productos });
    onClose();
  };

  const clienteSeleccionado = clientes.find(
    (c) => String(c.id) === String(formData.cliente_id)
  );

  const productosResumen = productos
    .map((p) => {
      const prod = productosDisponibles.find(
        (prod) => String(prod.id) === String(p.producto_id)
      );
      return prod ? `${prod.nombre} (x${p.cantidad})` : null;
    })
    .filter(Boolean);

  return (
    <div className="max-w-2xl relative bg-white rounded shadow flex flex-col">
      {/* Scrollable content */}
      <form
        onSubmit={handleSubmit}
        className="overflow-y-auto max-h-[75vh] p-4 space-y-6"
      >
        <h2 className="text-xl font-bold">Agregar Nuevo Pedido</h2>

        {/* Cliente y fecha */}
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
              <p className="text-sm text-gray-600 mt-1">
                Cliente seleccionado:{' '}
                <span className="font-medium text-gray-800">
                  {clienteSeleccionado?.nombre}
                </span>
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="fecha_acordada"
              value="Fecha de entrega acordada"
            />
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
          {productos.map((item, index) => (
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
                  {productosDisponibles.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label value="Cantidad" />
                <TextInput
                  type="number"
                  min={1}
                  value={item.cantidad}
                  onChange={(e) =>
                    handleProductoChange(
                      index,
                      'cantidad',
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex justify-end">
                {productos.length > 1 && (
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
        <div className="p-4 bg-gray-50 rounded border border-gray-200 space-y-2">
          <h3 className="font-semibold text-gray-700">Resumen del pedido:</h3>
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

      {/* Botones fijos */}
      <div className="flex justify-between p-4 border-t sticky bottom-0 bg-white z-10">
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
