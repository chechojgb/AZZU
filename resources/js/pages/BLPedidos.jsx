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
import TablaPedidosBL from '@/components/BL/tablaPedidosBL';
const breadcrumbs = [
  { title: "Pedidos BL", href: "/BLproductosInventario/pedidos" }
];


export default function BLPedidos({ user, productos, colores, clientes, pedidos }) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [modalOpen, setModalOpen] = useState(false);
  // console.log("Colores disponibles:", colores);
  // console.log("Productos disponibles:", productos);
  // console.log("clientes disponibles:", clientes);
  // console.log('pedidos disponibles:', pedidos);
  

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
        setModalOpen(false);
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
          // setToast({
          //   show: true,
          //   success: false,
          //   message: msg
          // });
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
          <TablaPedidosBL pedidos={pedidos}/>
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
