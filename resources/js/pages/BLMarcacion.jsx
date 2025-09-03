// resources/js/pages/BLHistorico.jsx

import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "flowbite-react";

const breadcrumbs = [
  { title: "Marcacion BL", href: "/BLproductosInventario/BLMarcacion" }
];

export default function MarcadoPage() {
  const [marcados, setMarcados] = useState([
    {
      id: 1,
      cliente: "Cliente A",
      producto: "Botón 1222 Azul",
      trabajador: "Pedro",
      fecha: "2025-09-03",
    },
    {
      id: 2,
      cliente: "Cliente B",
      producto: "Botón 1544 Rojo",
      trabajador: "María",
      fecha: "2025-09-03",
    },
  ]);

  const [nuevo, setNuevo] = useState({
    cliente: "",
    producto: "",
    trabajador: "",
    fecha: "",
  });

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const agregarMarcado = () => {
    if (!nuevo.cliente || !nuevo.producto || !nuevo.trabajador || !nuevo.fecha)
      return;
    setMarcados([
      ...marcados,
      { id: marcados.length + 1, ...nuevo },
    ]);
    setNuevo({ cliente: "", producto: "", trabajador: "", fecha: "" });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Histórico de Productos" />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📋 Registro de Marcado</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Columna Izquierda: Formulario + Tabla */}
          <div className="lg:col-span-3 space-y-6">
            {/* Formulario */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
              <h2 className="text-lg font-semibold mb-4">Agregar Marcado</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="cliente"
                  placeholder="Cliente"
                  value={nuevo.cliente}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  name="producto"
                  placeholder="Producto"
                  value={nuevo.producto}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="text"
                  name="trabajador"
                  placeholder="Trabajador"
                  value={nuevo.trabajador}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                />
                <input
                  type="date"
                  name="fecha"
                  value={nuevo.fecha}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div className="mt-4">
                <Button onClick={agregarMarcado}>Agregar</Button>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto shadow-md rounded-2xl">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Trabajador</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {marcados.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">{m.cliente}</td>
                      <td className="px-4 py-3">{m.producto}</td>
                      <td className="px-4 py-3">{m.trabajador}</td>
                      <td className="px-4 py-3">{m.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Columna Derecha: Timeline */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-3">
            <h2 className="text-base font-semibold mb-3">🕒 Línea de Tiempo</h2>
            <ol className="relative border-l border-gray-300 dark:border-gray-700 text-sm">
              {marcados.map((m) => (
                <li key={m.id} className="mb-6 ml-6">
                  <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white"></span>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {m.producto}
                  </h3>
                  <time className="block text-xs text-gray-500 dark:text-gray-400">
                    {m.fecha}
                  </time>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 text-xs">
                    Cliente: <strong>{m.cliente}</strong>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    Trabajador: <strong>{m.trabajador}</strong>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
