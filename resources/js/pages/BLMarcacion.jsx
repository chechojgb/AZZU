// resources/js/pages/BLHistorico.jsx

import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "flowbite-react";

const breadcrumbs = [
  { title: "Marcacion BL", href: "/BLproductosInventario/BLMarcacion" }
];

export default function MarcadoPage({ orderCustomer, buttonUser }) {
  const [marcados, setMarcados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [precios, setPrecios] = useState({});

  const [nuevo, setNuevo] = useState({
    cliente: "",
    clienteId: null,
    pedido: "",
    pedidoId: null,
    trabajador: "",
    trabajadorId: null,
    fecha: "",
  });

  const [sugerencias, setSugerencias] = useState([]);
  const [pedidosDisponibles, setPedidosDisponibles] = useState([]);
  const [itemsDisponibles, setItemsDisponibles] = useState([]);

  // --- Cliente ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevo({ ...nuevo, [name]: value });

    if (name === "cliente") {
      if (value.length > 0) {
        const filtrados = orderCustomer.filter((c) =>
          c.nombre.toLowerCase().includes(value.toLowerCase())
        );
        setSugerencias(filtrados);
      } else {
        setSugerencias([]);
      }
    }
  };

  const seleccionarCliente = (cliente) => {
    setNuevo({
      ...nuevo,
      cliente: cliente.nombre,
      clienteId: cliente.id,
      pedido: "",
      pedidoId: null,
      trabajador: "",
      trabajadorId: null,
      fecha: "",
    });
    setPedidosDisponibles(cliente.pedidos || []);
    setItemsDisponibles([]);
    setSugerencias([]);
    setSeleccionados([]);
  };

  // --- Pedido ---
  const seleccionarPedido = (pedido) => {
    setNuevo({
      ...nuevo,
      pedido: `#${pedido.id} - ${pedido.estado}`,
      pedidoId: pedido.id,
    });
    setItemsDisponibles(pedido.items || []);
    setSeleccionados([]);
  };

  // --- Guardar todo ---
  const guardarMarcaciones = () => {
    if (!nuevo.clienteId || !nuevo.pedidoId || !nuevo.trabajadorId || !nuevo.fecha) {
      alert("Debes seleccionar cliente, pedido, trabajador y fecha antes de marcar.");
      return;
    }

    if (seleccionados.length === 0) {
      alert("Debes seleccionar al menos un item.");
      return;
    }

    const payload = seleccionados.map((itemId) => {
      const item = itemsDisponibles.find(i => i.id === itemId);
      return {
        pedido_item_id: item.id,
        user_id: nuevo.trabajadorId,
        cantidad: item.cantidad_empaques,
        fecha: nuevo.fecha,
        pedido_id: nuevo.pedidoId,
        precio_unitario: nuevo.proyecto === "Button LoversMN" ? precios[itemId] || 0 : null, 
      };
    });

    router.post("/BLproductosInventario/bl_marcaciones", { marcaciones: payload }, {
      onSuccess: () => {
        console.log("Marcaciones guardadas:", payload);
        setSeleccionados([]);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Histórico de Productos" />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📋 Registro de Marcado</h1>

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Agregar Marcado</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Cliente */}
            <div className="relative">
              <input
                type="text"
                name="cliente"
                placeholder="Cliente"
                value={nuevo.cliente}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              {sugerencias.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-lg shadow-md mt-1 w-full max-h-40 overflow-y-auto">
                  {sugerencias.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => seleccionarCliente(c)}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                    >
                      {c.nombre} ({c.nit})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pedido */}
            <div>
              <select
                name="pedido"
                value={nuevo.pedidoId || ""}
                onChange={(e) => {
                  const pedidoSel = pedidosDisponibles.find(p => p.id == e.target.value);
                  if (pedidoSel) seleccionarPedido(pedidoSel);
                }}
                className="border rounded-lg p-2 w-full"
                disabled={pedidosDisponibles.length === 0}
              >
                <option value="">Seleccionar Pedido</option>
                {pedidosDisponibles.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.estado} ({p.fecha_pedido})
                  </option>
                ))}
              </select>
            </div>

            {/* Trabajador */}
            <div>
              <select
                name="trabajador"
                value={nuevo.trabajadorId || ""}
                onChange={(e) => {
                  const user = buttonUser.find(u => u.id == e.target.value);
                  if (user) {
                    setNuevo({
                      ...nuevo,
                      trabajador: user.name,
                      trabajadorId: user.id,
                      proyecto: user.proyecto, // 👈 guardamos el proyecto
                    });

                    // inicializar precios si es Button LoversMN
                    if (user.proyecto === "Button LoversMN") {
                      const preciosIniciales = {};
                      itemsDisponibles.forEach(i => {
                        preciosIniciales[i.id] = "";
                      });
                      setPrecios(preciosIniciales);
                    }
                  }
                }}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Seleccionar Trabajador</option>
                {buttonUser.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <input
              type="date"
              name="fecha"
              value={nuevo.fecha}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          {/* Items del pedido */}
          {itemsDisponibles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Items del Pedido</h3>
              <table className="w-full text-sm border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1">Referencia</th>
                    <th className="px-2 py-1">Cantidad</th>
                    <th className="px-2 py-1">Nota</th>
                    {nuevo.proyecto === "Button LoversMN" && (
                      <th className="px-2 py-1">💲 Precio Unitario</th>
                    )}
                    <th className="px-2 py-1">Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsDisponibles.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-2 py-1">{item.empaque?.producto?.descripcion}</td>
                      <td className="px-2 py-1">{item.cantidad_empaques}</td>
                      <td className="px-2 py-1">{item.nota || "—"}</td>

                      {nuevo.proyecto === "Button LoversMN" && (
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={precios[item.id] || ""}
                            onChange={(e) =>
                              setPrecios({ ...precios, [item.id]: e.target.value })
                            }
                            className="border rounded-lg p-1 w-24"
                          />
                        </td>
                      )}

                      <td className="px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSeleccionados([...seleccionados, item.id]);
                            } else {
                              setSeleccionados(seleccionados.filter(id => id !== item.id));
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Save button */}
              <div className="mt-4 flex justify-end">
                <Button
                  color="blue"
                  disabled={seleccionados.length === 0}
                  onClick={guardarMarcaciones}
                >
                  💾 Guardar Marcaciones
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Tabla resultado */}
        <div className="overflow-x-auto shadow-md rounded-2xl">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Items Marcados</th>
                <th className="px-4 py-3">Trabajador</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {marcados.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="px-4 py-3">{m.cliente}</td>
                  <td className="px-4 py-3">{m.pedido}</td>
                  <td className="px-4 py-3">
                    <ul>
                      {m.itemsMarcados.map((i, idx) => (
                        <li key={idx}>
                          {i.referencia} → {i.cantidad} {i.nota && `(Nota: ${i.nota})`}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">{m.trabajador}</td>
                  <td className="px-4 py-3">{m.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
