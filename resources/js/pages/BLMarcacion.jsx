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

// Hooks
import { useMarcaciones } from "@/components/BLHistorico/hooks/useMarcaciones";
import { useProcesarMarcaciones } from "@/components/BLHistorico/hooks/useProcesarMarcaciones";

const breadcrumbs = [
  { title: "Marcacion BL", href: "/BLproductosInventario/BLMarcacion" }
];

export default function MarcadoPage({ orderCustomer, buttonUser }) {
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const { enProceso, completados, pendientes } = useProcesarMarcaciones(orderCustomer);
  const datosMostrar = () => {
    switch (filtroActivo) {
      case 'enProceso': return enProceso;
      case 'completados': return completados;
      case 'pendientes': return pendientes;
      case 'todos': return [...enProceso, ...completados, ...pendientes];
      default: return [];
    }
  };
  console.log(orderCustomer);
  
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
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📋 Registro de Marcado</h1>

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Agregar Marcado</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
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
            <>
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
                  💾 Guardar Marcaciones
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Historial de Marcaciones</h2>
            <div className="text-sm text-gray-500">
              Mostrando: {datosMostrar().length} items
            </div>
          </div>
          
          <FiltrosMarcaciones 
            filtroActivo={filtroActivo} 
            onChangeFiltro={setFiltroActivo} 
          />
          
          <ResultTable 
            datos={datosMostrar()} 
            tipo={filtroActivo} 
          />
        </div>
      </div>
    </AppLayout>
  );
}