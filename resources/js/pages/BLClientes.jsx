// import AppLayout from '@/layouts/app-layout';
// import { Head } from '@inertiajs/react';

// const breadcrumbs = [
//   { title: "Clientes", href: "/clientes" }
// ];

// export default function Clientes({ clientes }) {
// return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//         <Head title="Clientes" />

//         <div className="p-4 space-y-4">
//             <h2 className="text-xl font-semibold">Listado de clientes</h2>

//             <div className="overflow-x-auto rounded-lg shadow-md">
//                 {clientes.length === 0 ? (
//                     <div className="p-6 text-center text-gray-500">
//                         No hay clientes registrados.
//                     </div>
//                 ) : (
//                     <table className="w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
//                         <thead className="text-xs text-gray-700 uppercase bg-gray-100">
//                             <tr>
//                                 <th className="px-6 py-3">Nombre</th>
//                                 <th className="px-6 py-3">Contacto</th>
//                                 <th className="px-6 py-3">Teléfono</th>
//                                 <th className="px-6 py-3">Ciudad</th>
//                                 <th className="px-6 py-3">Estado</th>
//                                 <th className="px-6 py-3">Acciones</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {clientes.map(cliente => (
//                                 <tr key={cliente.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
//                                     <td className="px-6 py-4">{cliente.nombre}</td>
//                                     <td className="px-6 py-4">{cliente.contacto}</td>
//                                     <td className="px-6 py-4">{cliente.telefono}</td>
//                                     <td className="px-6 py-4">{cliente.ciudad}</td>
//                                     <td className="px-6 py-4">
//                                         {cliente.activo ? (
//                                             <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Activo</span>
//                                         ) : (
//                                             <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Inactivo</span>
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <button className="text-blue-600 hover:underline mr-2">Ver</button>
//                                         <button className="text-yellow-600 hover:underline mr-2">Editar</button>
//                                         <button className="text-red-600 hover:underline">Eliminar</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     </AppLayout>
// );
// }


import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Link, usePage } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { themeByProject } from '@/components/utils/theme';
import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import AgentModalWrapper from '@/components/agentsModalWrapper';
import { ModalAddClientesBL } from '@/components/BL/modalesBL';
import { router } from '@inertiajs/react';
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import CustomerDetailsContainer from '@/components/BL/DetailsCustomerModal';
import BigModalWrapper from '@/components/BL/BigmodalWrapper';
import EditarClienteForm from '@/components/BL/EditClientModal';
import axios from "axios";

const breadcrumbs = [
  { title: "Clientes", href: "/clientesBL" }
];



export default function Clientes({clientes}) {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenClient, setModalOpenClient] = useState(false);
  const [modalOpenClientEdit, setModalOpenClientEdit] = useState(false);
  // console.log('clientes', clientes);
  const [clienteDetails, setClienteDetails] = useState(null);
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
  
  useEffect(() => {
    if (props.toast) {
      console.log("🎉 props.toast recibido:", props.toast);
      setToast({
        show: true,
        success: props.toast.type === 'success',
        message: props.toast.message,
      });

      // Ocultar toast automáticamente después de 3 segundos
      const timeout = setTimeout(() => {
        setToast({ show: false, success: false, message: '' });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [props.toast])

  const handleGuardarCliente = (clientData) => {
    console.log('datos cliente',clientData);
    router.post(route('clientesBL.store'), clientData, {
      preserveState: true,
      onSuccess: () => {
        setToast({
          show: true,
          success: true,
          message: "cliente guardado correctamente"
        });
        // Refrescar la lista de clientes
        // router.visit(route('clientes.index'));
      },
      onError: (errors) => {
      const primerError = Object.values(errors)[0];
      setToast({
        show: true,
        success: false,
        message: primerError || "Error al guardar el cliente"
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
  const handleEditarCliente = (clientData) => {
    console.log('datos cliente',clientData);
    router.post(route('clientesBL.update'), clientData, {
      preserveState: true,
      onSuccess: () => {
        setToast({
          show: true,
          success: true,
          message: "cliente editado correctamente"
        });
        // Refrescar la lista de clientes
        // router.visit(route('clientes.index'));
      },
      onError: (errors) => {
      const primerError = Object.values(errors)[0];
      setToast({
        show: true,
        success: false,
        message: primerError || "Error al editar el cliente"
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

  const openModal = () => {
      setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalOpenClient(false);
    setClienteDetails(false);
    setModalOpenClientEdit(false);
  };
  const openModalClient = async (id)=> {
    try {
      const response = await axios.get(`BLClientesShow/${id}`); 
      setClienteDetails(response.data.clientesDetails);
      setModalOpenClient(true);
    } catch (error) {
      console.error("Error al cargar el cliente", error);
    }
  }
  const openModalEditClient = async(id) => {
    try {
      const response = await axios.get(`BLClientesShow/${id}`); 
      setClienteDetails(response.data.clientesDetails);
      setModalOpenClientEdit(true);
    } catch (error) {
      console.error("Error al cargar el cliente", error);
    }
  }



  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clientes" />

      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Listado de clientes</h2>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <Button className={`${theme.bgHard} dark:${theme.bg} ${theme.bgHover} dark:${theme.bgHover} mb-4 mr-2`} onClick={() => openModal()}>
              <ClipboardList  />
              Agregar nuevo cliente
          </Button>
          <table className="w-full text-sm text-left  border ">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Ciudad</th>
                {/* <th className="px-6 py-3">Estado</th> */}
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4">{cliente.nombre}</td>
                  <td className="px-6 py-4">{cliente.contacto}</td>
                  <td className="px-6 py-4">{cliente.telefono}</td>
                  <td className="px-6 py-4">{cliente.email}</td>
                  <td className="px-6 py-4">{cliente.ciudad}</td>
                  {/* <td className="px-6 py-4">
                    {cliente.activo ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Activo</span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Inactivo</span>
                    )}
                  </td> */}
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => openModalClient(cliente.id)} >Ver</button>
                    <button className="text-yellow-600 hover:underline mr-2" onClick={()=> openModalEditClient(cliente.id)}>Editar</button>
                    <button className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modalOpen && (
          <AgentModalWrapper closeModal={closeModal}>
                <ModalAddClientesBL  onClose={closeModal} onSave={handleGuardarCliente}/>
          </AgentModalWrapper>
        )}
        {modalOpenClient && (
          <BigModalWrapper closeModal={closeModal}>
            <CustomerDetailsContainer closeModal={closeModal} clienteDetails={clienteDetails}/>
            {/* <ModalAddClientesBL  onClose={closeModal} onSave={handleGuardarCliente}/> */}
          </BigModalWrapper>
        )}
        {modalOpenClientEdit && (
          <AgentModalWrapper closeModal={closeModal}>
              <EditarClienteForm closeModal={closeModal} clienteDetails={clienteDetails} onSave={handleEditarCliente} />
          </AgentModalWrapper>
        )
        }
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
