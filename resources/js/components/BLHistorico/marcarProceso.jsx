import React, { useState, useEffect } from 'react';
import { Button, Toast } from "flowbite-react";
import { SaveAll, RefreshCw } from 'lucide-react';
import { HiCheck, HiX } from "react-icons/hi";
import { router, usePage } from '@inertiajs/react';
import ClienteSelector from './ClienteSelector';
import PedidoSelector from './PedidoSelector';
import TrabajadorSelector from './TrabajadorSelector';
import FechaSelector from './FechaSelector';
import ItemsTable from './ItemsTable';

const MarcacionForm = ({ itemsPedidos, orderCustomer, buttonUser }) => {

  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para el formulario
  const [nuevo, setNuevo] = useState({
    cliente: '',
    clienteId: '',
    pedidoId: '',
    trabajador: '',
    trabajadorId: '',
    proyecto: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  
  const [sugerencias, setSugerencias] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [itemsFiltrados, setItemsFiltrados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [precios, setPrecios] = useState({});
  const [toast, setToast] = useState({ show: false, success: false, message: "" });

  // Variables seguras para los datos
  const clientesDisponibles = Array.isArray(orderCustomer) ? orderCustomer : [];
  const trabajadoresDisponibles = Array.isArray(buttonUser) ? buttonUser : [];
  const itemsDisponibles = Array.isArray(itemsPedidos) ? itemsPedidos : [];

  // Efecto para ocultar el toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, success: false, message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Filtrar sugerencias de clientes
  useEffect(() => {
    const clienteBusqueda = nuevo.cliente || '';
    if (clienteBusqueda && clienteBusqueda.length > 1) {
      const sugerenciasFiltradas = clientesDisponibles.filter(cliente =>
        (cliente.nombre && cliente.nombre.toLowerCase().includes(clienteBusqueda.toLowerCase())) ||
        (cliente.nit && cliente.nit.includes(clienteBusqueda))
      );
      setSugerencias(sugerenciasFiltradas);
    } else {
      setSugerencias([]);
    }
  }, [nuevo.cliente, clientesDisponibles]);

  // Filtrar pedidos cuando se selecciona un cliente
  useEffect(() => {
    if (nuevo.clienteId) {
      const pedidosDelCliente = itemsDisponibles
        .filter(item => item && item.pedido && item.pedido.cliente_id === parseInt(nuevo.clienteId))
        .map(item => item.pedido)
        .filter((pedido, index, self) => 
          index === self.findIndex(p => p && p.id === pedido.id)
        );
      
      setPedidosFiltrados(pedidosDelCliente);
      setNuevo(prev => ({ ...prev, pedidoId: '' }));
      setItemsFiltrados([]);
      setSeleccionados([]);
    } else {
      setPedidosFiltrados([]);
    }
  }, [nuevo.clienteId, itemsDisponibles]);

  // Filtrar items cuando se selecciona un pedido
  useEffect(() => {
    if (nuevo.pedidoId) {
      const itemsDelPedido = itemsDisponibles.filter(
        item => item && item.pedido_id === parseInt(nuevo.pedidoId)
      );
      setItemsFiltrados(itemsDelPedido);
      setSeleccionados([]);
    } else {
      setItemsFiltrados([]);
    }
  }, [nuevo.pedidoId, itemsDisponibles]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevo(prev => ({ 
      ...prev, 
      [name]: value || '' 
    }));
  };

  // Seleccionar un cliente de las sugerencias
  const seleccionarCliente = (cliente) => {
    if (cliente) {
      setNuevo(prev => ({
        ...prev,
        cliente: cliente.nombre || '',
        clienteId: cliente.id || ''
      }));
      setSugerencias([]);
    }
  };

  // Seleccionar un pedido
  const seleccionarPedido = (pedido) => {
    if (pedido) {
      setNuevo(prev => ({
        ...prev,
        pedidoId: pedido.id || ''
      }));
    }
  };

  // Toggle selección de items
  const toggleSeleccion = (id, checked) => {
    if (checked) {
      setSeleccionados([...seleccionados, id]);
    } else {
      setSeleccionados(seleccionados.filter(itemId => itemId !== id));
    }
  };

  // Función para actualizar la fecha
  const setFecha = (fecha) => {
    setNuevo(prev => ({ ...prev, fecha }));
  };

  // Función para guardar las marcaciones
  const guardarMarcaciones = () => {
    if (!nuevo.clienteId || !nuevo.pedidoId || !nuevo.trabajadorId || !nuevo.fecha) {
      setToast({
        show: true,
        success: false,
        message: "Debes seleccionar cliente, pedido, trabajador y fecha antes de marcar."
      });
      return;
    }

    if (seleccionados.length === 0) {
      setToast({
        show: true,
        success: false,
        message: "Debes seleccionar al menos un item."
      });
      return;
    }

    setIsLoading(true);

    const payload = seleccionados.map((itemId) => {
      const item = itemsFiltrados.find(i => i && i.id === itemId);
      return {
        pedido_item_id: item ? item.id : 0,
        user_id: nuevo.trabajadorId,
        cantidad: item ? item.cantidad_empaques : 0,
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
            message: "Marcación guardada correctamente. Recargando datos..."
            });

            setSeleccionados([]);
            setPrecios({});

            setTimeout(() => {
            router.reload({             // ✅ usar router.reload, no Inertia.reload
                only: ['itemsPedidos'],
                onFinish: () => setIsLoading(false)
            });
            }, 1500);
        },
        onError: (errors) => {
            setIsLoading(false);
            const primerError = Object.values(errors)[0];
            setToast({
            show: true,
            success: false,
            message: primerError || "Error al guardar la marcación"
            });
        }
        });
    };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Agregar Marcado</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <ClienteSelector
          nuevo={nuevo}
          handleChange={handleChange}
          sugerencias={sugerencias}
          seleccionarCliente={seleccionarCliente}
        />

        <PedidoSelector
          nuevo={nuevo}
          pedidosDisponibles={pedidosFiltrados}
          seleccionarPedido={seleccionarPedido}
        />

        <TrabajadorSelector
          nuevo={nuevo}
          buttonUser={trabajadoresDisponibles}
          setNuevo={setNuevo}
          itemsDisponibles={itemsFiltrados}
          setPrecios={setPrecios}
        />

        <FechaSelector
          fecha={nuevo.fecha}
          setFecha={setFecha}
          nuevo={nuevo}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <ItemsTable
          itemsDisponibles={itemsFiltrados}
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
            disabled={seleccionados.length === 0 || isLoading}
            onClick={guardarMarcaciones}
          >
            {isLoading ? (
              <RefreshCw size={16} className="animate-spin mr-2" />
            ) : (
              <SaveAll className="mr-2" size={16} />
            )}
            {isLoading ? 'Guardando...' : 'Guardar Marcaciones'}
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              toast.success ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
            }`}>
              {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
          </Toast>
        </div>
      )}
    </div>
  );
};

export default MarcacionForm;