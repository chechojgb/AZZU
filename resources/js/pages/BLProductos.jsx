import { use, useEffect, useState } from 'react';
import { Head,Link, usePage,router  } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BTOList from '@/components/BLlist';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { Button } from "flowbite-react";
import { ClipboardList } from 'lucide-react';
import AgentModalWrapper from '@/components/agentsModalWrapper';
import TerminalModalEditContent from '@/components/terminalModalEdit';
import { themeByProject } from '@/components/utils/theme';
import { HiCheck, HiX } from "react-icons/hi";
import { Toast } from "flowbite-react";
import AgregarProductoModal from '@/components/BL/agregarProductosModal';
import AddDbColores from '@/components/BL/modalAddColoresBL';
import TablaProductosBL from '@/components/BL/tablaProdBL';

// import { log } from 'node:console';

const breadcrumbs = [
  { title: 'Administracion de productos Button Lovers', href: '/BLProductos' },
];

export default function BLProductos({productos, colores}) {
  console.log(productos);
  
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenColores, setModalOpenColores] = useState(false);
    const [modalOpenEdit, setModalOpenEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
    const { props } = usePage();
    const proyecto = props?.auth?.user?.proyecto || 'AZZU';
    const theme = themeByProject[proyecto];
    const [search, setSearch] = useState('');
    console.log(search);
    

    const handleGuardarProducto = (productoData) => {
      console.log(productoData);
      router.post(route('productosBL.store'), productoData, {
        preserveState: true,
        onSuccess: () => {
          setToast({
            show: true,
            success: true,
            message: "Producto guardado correctamente"
          });
          // Refrescar la lista de productos
          // router.visit(route('productos.index'));
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
    const handleGuardarColor = (colorData) => {
    console.log(colorData);
    router.post(route('coloresBL.store'), colorData, {
      preserveState: true,
      onSuccess: (response) => {
        console.log("✅ onSuccess ejecutado");
        // Usamos la respuesta del servidor para mostrar el mensaje
        setToast({
          show: true,
          success: response.props.success ?? true,
          message: response.props.message || "Operación completada"
        });
        // router.visit(route('productos.index'));
      },
      onError: (errors) => {
        const primerError = Object.values(errors)[0];
        setToast({
          show: true,
          success: false,
          message: primerError || "Error al guardar el color"
        });
      }
    });
    };

    const [toast, setToast] = useState({
        show: false,
        success: false,
        message: "",
    });

    const openModal = () => {
      if (!colores || colores.length === 0) {
        setToast({
          show: true,
          success: false,
          message: "No se pueden agregar productos porque no hay colores disponibles.",
        });
        return;
      }
      setModalOpen(true);
    };
    const openModalColores = () => setModalOpenColores(true);

    const openModalEdit = (area) => {
        setSelectedArea(area);
        setModalOpenEdit(true);
    }

    const closeModal = () => {
        setModalOpen(false);
        setModalOpenColores(false);
        setModalOpenEdit(false)
    };



  console.log("colores cargados:", colores);

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

  // if (loading) return <p className="p-4">Cargando productos...</p>;

  


  


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        
        
        <div className="min-h-[100vh] md:min-h-min">
          <div className='flex   mb-4'>
            <Button className={`${theme.bgHard} dark:${theme.bg} ${theme.bgHover} dark:${theme.bgHover} mb-4 mr-2`} onClick={() => openModal()}>
                <ClipboardList  />
                Agregar bolsa
            </Button>
            <Button className={`${theme.bgHard} dark:${theme.bg} ${theme.bgHover} dark:${theme.bgHover} mb-4 mr-2`} onClick={() => openModalColores()}>
                <ClipboardList  />
                Agregar nuevo color
            </Button>

          </div>
            
          <div className="">
            {/* Header de la tabla con buscador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Lista de Productos
              </h2>
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
              <TablaProductosBL productos={productos} search={search} />
            </div>
          </div>

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
      

        {modalOpen && (
            <AgentModalWrapper closeModal={closeModal}>
                <AgregarProductoModal 
                  onClose={closeModal} onSave={handleGuardarProducto} colores={colores}
                />
            </AgentModalWrapper>
        )}
        {modalOpenColores && (
            <AgentModalWrapper closeModal={closeModal}>
                <AddDbColores onClose={closeModal} onSave={handleGuardarColor}/>
            </AgentModalWrapper>
        )}

        {modalOpenEdit && (
            <AgentModalWrapper closeModal={closeModal}>
                <TerminalModalEditContent  onClose={closeModal} setToast={setToast} terminal={selectedArea}/>
            </AgentModalWrapper>
        )}
    </AppLayout>
  );
}
