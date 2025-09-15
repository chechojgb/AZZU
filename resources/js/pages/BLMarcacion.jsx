// resources/js/pages/BLHistorico.jsx
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { useState } from "react";
// Componentes
import ClienteSelector from "@/components/BLHistorico/ClienteSelector";
import PedidoSelector from "@/components/BLHistorico/PedidoSelector";
import TrabajadorSelector from "@/components/BLHistorico/TrabajadorSelector";
import FechaSelector from "@/components/BLHistorico/FechaSelector";
import ItemsTable from "@/components/BLHistorico/ItemsTable";
import ResultTable from "@/components/BLHistorico/ResultTable";
import FiltrosMarcaciones from "@/components/BLHistorico/FiltrosMarcaciones";
import FiltroUsuario from "@/components/BLHistorico/FiltroUsuario";
import TablaMarcacionBL from "@/components/BL/tablaMarcacionBL";
import {
    BookText,
    SaveAll
} from 'lucide-react';

// Hooks
import { useMarcaciones } from "@/components/BLHistorico/hooks/useMarcaciones";

const breadcrumbs = [
  { title: "Marcacion BL", href: "/BLproductosInventario/BLMarcacion" }
];

export default function MarcadoPage({ orderCustomer, buttonUser, itemsPedidos }) {
  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [trabajadorFiltro, setTrabajadorFiltro] = useState("");
  const itemsFiltrados = itemsPedidos.filter((item) => {
    // Filtrar por estado (si aplica)
    const coincideEstado = estadoFiltro === "" ? true : item.estado === estadoFiltro;

    // Filtrar por trabajador (si aplica)
    const coincideTrabajador =trabajadorFiltro === "" ? true : item.marcaciones?.[0]?.trabajador?.id === parseInt(trabajadorFiltro);

    // El item debe cumplir con ambos filtros
    return coincideEstado && coincideTrabajador;
  });
  
  const {
    marcados,
    seleccionados,
    setSeleccionados,
    precios,
    setPrecios,
    nuevo,
    setNuevo,
    sugerencias,
    setSugerencias,
    pedidosDisponibles,
    setPedidosDisponibles,
    itemsDisponibles,
    setItemsDisponibles
  } = useMarcaciones();

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
      <div className="w-full p-2 sm:p-6 ">
        <h1 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 flex items-center gap-2"><BookText/> Registro de Marcado</h1>

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Agregar Marcado</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <ClienteSelector
              nuevo={nuevo}
              handleChange={handleChange}
              sugerencias={sugerencias}
              seleccionarCliente={seleccionarCliente}
              orderCustomer={orderCustomer}
            />

            <PedidoSelector
              nuevo={nuevo}
              pedidosDisponibles={pedidosDisponibles}
              seleccionarPedido={seleccionarPedido}
            />

            <TrabajadorSelector
              nuevo={nuevo}
              buttonUser={buttonUser}
              setNuevo={setNuevo}
              itemsDisponibles={itemsDisponibles}
              setPrecios={setPrecios}
            />

            <FechaSelector
              nuevo={nuevo}
              handleChange={handleChange}
            />
          </div>

          {/* Items del pedido */}
          {itemsDisponibles.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <ItemsTable
                itemsDisponibles={itemsDisponibles}
                seleccionados={seleccionados}
                setSeleccionados={setSeleccionados}
                nuevo={nuevo}
                precios={precios}
                setPrecios={setPrecios}
              />

              {/* Save button */}
              <div className="mt-4 flex justify-end">
                <Button
                  color="blue"
                  disabled={seleccionados.length === 0}
                  onClick={guardarMarcaciones}
                >
                  <SaveAll/> Guardar Marcaciones
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="">
          {/* Header de la tabla con buscador */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Lista de items
              </h2>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filtrar por estado:
                </label>
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en proceso">En proceso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filtrar por trabajador:
                </label>
                <select
                  value={trabajadorFiltro}
                  onChange={(e) => setTrabajadorFiltro(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Seleccionar trabajador</option>
                  {buttonUser.map((trabajador) => (
                    <option key={trabajador.id} value={trabajador.id}>
                      {trabajador.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="relative w-full sm:w-72">
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M15.5 10.5a5 5 0 11-10 0 5 5 0 0110 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Buscar producto..."
              />
            </div>
          </div>


          {/* Contenedor de la tabla */}
          <div className="overflow-x-auto">
            <TablaMarcacionBL itemsPedidos={itemsFiltrados} search={search} estadoFiltro={estadoFiltro}/>
          </div>
        </div>
   
      </div>
    </AppLayout>
  );
}