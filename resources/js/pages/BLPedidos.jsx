import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Link, usePage } from "@inertiajs/react";
import { themeByProject } from '@/components/utils/theme';
import { Button } from "flowbite-react";
import { ClipboardList } from 'lucide-react';
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { useState, useEffect } from 'react';
import AgentModalWrapper from '@/components/agentsModalWrapper';
import ModalPedidosBL from '@/components/BL/modalesBL';
import { router } from '@inertiajs/react';
const breadcrumbs = [
  { title: "Pedidos BL", href: "/BLproductosInventario/pedidos" }
];

export default function BLPedidos({ user, productos, colores, clientes, pedidos }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [modalOpen, setModalOpen] = useState(false);
  console.log("Colores disponibles:", colores);
  console.log("Productos disponibles:", productos);
  console.log("clientes disponibles:", clientes);
  console.log('pedidos disponibles:', pedidos);
  

  const handleGuardarPedido = (clientData) => {
    console.log('datos cliente',clientData);
    router.post(route('pedidosBL.store'), clientData, {
      preserveState: true,
      onSuccess: () => {
        setToast({
          show: true,
          success: true,
          message: "Producto guardado correctamente"
        });
        // Refrescar la lista de productos
        // router.visit(route('clientes.index'));
      },
      onError: (errors) => {
      const primerError = Object.values(errors)[0];
      setToast({
        show: true,
        success: false,
        message: primerError || "Error al guardar el producto"
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
  
  
  const openModal = () => {
      setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pedidos" />

      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Lista de pedidos</h2>
        <Button className={`${theme.bgHard} dark:${theme.bg} ${theme.bgHover} dark:${theme.bgHover} mb-4 mr-2`} onClick={() => openModal()}>
            <ClipboardList  />
            Agregar nuevo pedido
        </Button>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-left   border ">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3">Productos</th>
                <th scope="col" className="px-6 py-3">Fecha acordada</th>
                <th scope="col" className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(cliente => {
                // Agrupar items por producto_id y sumar cantidades
                const productosAgrupados = cliente.items.reduce((acc, item) => {
                const productoId = item.empaque.producto.id;
                const nombreProducto = item.empaque.producto.descripcion;

                if (!acc[productoId]) {
                  acc[productoId] = {
                    nombre: nombreProducto,
                    cantidad: 0
                  };
                }
                acc[productoId].cantidad += item.cantidad_empaques;
                return acc;
                }, {});
                const listaProductos = Object.values(productosAgrupados);
                const estadosStyle = {
                  pendiente: 'text-yellow-800 bg-yellow-100',
                  entregado: 'text-green-800 bg-green-100',
                  cancelado: 'text-red-800 bg-red-100'
                }
                return (
                      <tr
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                        key={cliente.id}
                      >
                        <td className="px-6 py-4">{cliente.cliente.nombre}</td>

                        <td className="px-6 py-4 space-y-1">
                          {listaProductos.map((prod, idx) => (
                            <div key={idx}>
                              {prod.nombre}{" "}
                              <span className="text-gray-500">x{prod.cantidad}</span>
                            </div>
                          ))}
                        </td>

                        <td className="px-6 py-4">{cliente.fecha_pedido}</td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold ${estadosStyle[cliente.estado] || 'text-gray-800 bg-gray-100'} rounded-full`}>
                            {cliente.estado}
                          </span>
                        </td>
                      </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* //MODALES Y TOAST */}
        {modalOpen && (
            <AgentModalWrapper closeModal={closeModal}>
                <ModalPedidosBL clientes={clientes} productos={productos} onClose={closeModal} setToast={setToast} onSave={handleGuardarPedido}/>
            </AgentModalWrapper>
        )}
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
