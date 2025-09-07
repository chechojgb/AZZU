// resources/js/pages/BLHistorico.jsx

import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { Button } from "flowbite-react";
import { router } from '@inertiajs/react';

const breadcrumbs = [
  { title: "Marcacion BL", href: "/BLproductosInventario/BLMarcacion" }
];

export default function MarcadoPage({ orderCustomer, buttonUser }) {
  // console.log('marcadores:',buttonUser);
  
  const [marcados, setMarcados] = useState([]);

  const [nuevo, setNuevo] = useState({
    cliente: "",
    clienteId: null,
    pedido: "",
    pedidoId: null,
    itemsMarcados: [], // [{itemId, referencia, cantidad, nota}]
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
      itemsMarcados: [],
      trabajador: "",
      trabajadorId: null,
      fecha: "",
    });
    setPedidosDisponibles(cliente.pedidos || []);
    setItemsDisponibles([]);
    setSugerencias([]);
  };

  // --- Pedido ---
  const seleccionarPedido = (pedido) => {
    setNuevo({
      ...nuevo,
      pedido: `#${pedido.id} - ${pedido.estado}`,
      pedidoId: pedido.id,
      itemsMarcados: []
    });
    setItemsDisponibles(pedido.items || []);
  };

  // --- Items ---
  const toggleItem = (item, checked) => {
    let updated;

    if (checked) {
      // agregar item marcado con su cantidad total
      updated = [
        ...nuevo.itemsMarcados,
        {
          itemId: item.id,
          referencia: item.empaque?.producto?.descripcion,
          cantidad: item.cantidad_empaques,
          nota: item.nota,
        }
      ];
    } else {
      // quitar item
      updated = nuevo.itemsMarcados.filter(i => i.itemId !== item.id);
    }

    setNuevo({ ...nuevo, itemsMarcados: updated });
  };


  // --- Total y Resumen ---
  const totalMarcados = useMemo(() => {
    return nuevo.itemsMarcados.reduce((acc, i) => acc + i.cantidad, 0);
  }, [nuevo.itemsMarcados]);

  const resumenMarcados = useMemo(() => {
    return nuevo.itemsMarcados
      .map(i => `${i.cantidad} ${i.referencia}`)
      .join(" + ");
  }, [nuevo.itemsMarcados]);

  // --- Guardar ---
  const agregarMarcado = () => {
    if (!nuevo.clienteId || !nuevo.pedidoId || nuevo.itemsMarcados.length === 0 || !nuevo.trabajadorId || !nuevo.fecha) return;

    router.post("/BLproductosInventario/bl_marcaciones", nuevo, {
      onSuccess: () => {
        setNuevo({
          cliente: "",
          clienteId: null,
          pedido: "",
          pedidoId: null,
          itemsMarcados: [],
          trabajador: "",
          trabajadorId: null,
          fecha: "",
        });
        setPedidosDisponibles([]);
        setItemsDisponibles([]);
        setSugerencias([]);
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
                      trabajadorId: user.id
                    });
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
                    <th className="px-2 py-1">Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsDisponibles.map((item) => {
                    const checked = nuevo.itemsMarcados.some(i => i.itemId === item.id);
                    return (
                      <tr key={item.id} className="border-t">
                        <td className="px-2 py-1">{item.empaque?.producto?.descripcion}</td>
                        <td className="px-2 py-1">{item.cantidad_empaques}</td>
                        <td className="px-2 py-1">{item.nota || "—"}</td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => toggleItem(item, e.target.checked)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Contador y resumen */}
              <div className="mt-3 p-2 bg-gray-100 rounded-lg">
                <p className="font-semibold">
                  Total a marcar: {totalMarcados}
                </p>
                {resumenMarcados && (
                  <p className="text-sm text-gray-700">
                    Detalle: {resumenMarcados}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            <Button onClick={agregarMarcado}>Agregar</Button>
          </div>
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
