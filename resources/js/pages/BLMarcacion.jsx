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
import TablaMarcacionBL from "@/components/BL/tablaMarcacionBL";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useEffect } from "react";
import {
    BookText,
    SaveAll
} from 'lucide-react';
import MarcacionForm from "@/components/BLHistorico/marcarProceso";

// Hooks
import { useMarcaciones } from "@/components/BLHistorico/hooks/useMarcaciones";

const breadcrumbs = [
  { title: "Marcacion BL", href: "/BLproductosInventario/BLMarcacion" }
];

export default function MarcadoPage({ orderCustomer, buttonUser, itemsPedidos }) {
  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [trabajadorFiltro, setTrabajadorFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [toast, setToast] = useState({
        show: false,
        success: false,
        message: "",
  });
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, success: false, message: '' });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const filtrarPorFecha = (item, inicio, fin) => {
    if (!inicio && !fin) return true; // Si no hay filtros de fecha
    
    const fechaItem = new Date(item.updated_at);
    
    if (inicio && fin) {
      const start = new Date(inicio);
      const end = new Date(fin);
      end.setHours(23, 59, 59); // Incluir todo el día final
      return fechaItem >= start && fechaItem <= end;
    }
    
    if (inicio) {
      const start = new Date(inicio);
      return fechaItem >= start;
    }
    
    if (fin) {
      const end = new Date(fin);
      end.setHours(23, 59, 59);
      return fechaItem <= end;
    }
    
    return true;
  };
  const itemsFiltrados = itemsPedidos.filter((item) => {
    // Filtrar por estado
    const coincideEstado = estadoFiltro === "" ? true : item.estado === estadoFiltro;
    
    // Filtrar por trabajador
    const coincideTrabajador = trabajadorFiltro === "" ? true : 
    item.marcaciones?.[0]?.trabajador?.id === parseInt(trabajadorFiltro);
    
    // Filtrar por fecha
    const coincideFecha = filtrarPorFecha(item, fechaInicio, fechaFin);
    
    // El item debe cumplir con todos los filtros
    return coincideEstado && coincideTrabajador && coincideFecha;
  });
  
  // Función para filtrar por rango de fechas
  
  // console.log(itemsFiltrados, fechaFin);
  
  // Limpiar filtros
  const limpiarFiltros = () => {
    setEstadoFiltro('');
    setTrabajadorFiltro('');
    setFechaInicio('');
    setFechaFin('');
    setSearch('');
  };
  
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
      // alert("Debes seleccionar cliente, pedido, trabajador y fecha antes de marcar.");
      setToast({
        show: true,
        success: false,
        message: "Debes seleccionar cliente, pedido, trabajador y fecha antes de marcar."
      });
      return;
      
    }

    if (seleccionados.length === 0) {
      // alert("Debes seleccionar al menos un item.");
      setToast({
        show: true,
        success: false,
        message: "Debes seleccionar al menos un item.."
      });
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

    router.post(route('bl_marcaciones.store'), { marcaciones: payload }, {
      preserveState: true,
      onSuccess: () => {
        setToast({
          show: true,
          success: true,
          message: "Marcacion guardada correctamente"
        });

        // Refrescar la lista de productos
        // router.visit(route('productos.index'));
      },
      onError: (errors) => {
      const primerError = Object.values(errors)[0];
      setToast({
        show: true,
        success: false,
        message: primerError || "Error al guardar la marcacion"
      });
      },
      onFinish: (visit) => {
        // Si hubo error de servidor (status 500 o más)
        if (visit.response?.status >= 500) {
          const msg = visit.response?.data?.message || "Error interno del servidor";
          setToast({
            show: true,
            success: false,
            message: msg
          });
        }
      }
    });

  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Histórico de Productos" />
      <div className="w-full p-2 sm:p-6 ">
        <h1 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 flex items-center gap-2"><BookText/> Registro de Marcado</h1>

        {/* Formulario */}
        <MarcacionForm orderCustomer={orderCustomer} buttonUser={buttonUser} itemsPedidos={itemsPedidos}/>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
          {/* Header con filtros */}
          <div className="flex flex-col p-4 gap-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Lista de items
              </h2>
              <button
                onClick={limpiarFiltros}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Limpiar filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado:
                </label>
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en proceso">En proceso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>

              {/* Filtro por trabajador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trabajador:
                </label>
                <select
                  value={trabajadorFiltro}
                  onChange={(e) => setTrabajadorFiltro(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Todos los trabajadores</option>
                  {buttonUser.map((trabajador) => (
                    <option key={trabajador.id} value={trabajador.id}>
                      {trabajador.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por fecha inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha inicio:
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              {/* Filtro por fecha fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha fin:
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            {/* Búsqueda general */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M15.5 10.5a5 5 0 11-10 0 5 5 0 0110 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Buscar en todos los campos..."
              />
            </div>

            {/* Info de filtros aplicados */}
            {(estadoFiltro || trabajadorFiltro || fechaInicio || fechaFin) && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Filtros aplicados: 
                {estadoFiltro && <span className="ml-2 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">Estado: {estadoFiltro}</span>}
                {trabajadorFiltro && <span className="ml-2 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Trabajador: {buttonUser.find(t => t.id === parseInt(trabajadorFiltro))?.name}</span>}
                {fechaInicio && <span className="ml-2 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">Desde: {new Date(fechaInicio).toLocaleDateString()}</span>}
                {fechaFin && <span className="ml-2 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">Hasta: {new Date(fechaFin).toLocaleDateString()}</span>}
              </div>
            )}
          </div>

          {/* Tabla con los datos filtrados */}
          <div className="overflow-x-auto">
            <TablaMarcacionBL 
              itemsPedidos={itemsFiltrados} 
              search={search} 
            />
          </div>
        </div>
        {toast.show && (
          <div className="fixed bottom-6 right-6 z-51">
          <Toast>
              <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  toast.success ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
              }`}
              >
              {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
              </div>
              <div className="ml-3 text-sm font-normal">{toast.message}</div>
          </Toast>
          </div>
        )}
      </div>
    </AppLayout>
  );
}