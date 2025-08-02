import { useEffect, useState } from 'react';
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
// import { log } from 'node:console';

const breadcrumbs = [
  { title: 'Administracion de productos Button Lovers', href: '/BLProductos' },
];

export default function BLProductos() {
    const [productos, setProductos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenEdit, setModalOpenEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
    const { props } = usePage();
    const proyecto = props?.auth?.user?.proyecto || 'AZZU';
    const theme = themeByProject[proyecto];

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
          router.reload({
            only: ['productos'],
            preserveState: true
          });
        },
        onError: (errors) => {
          setToast({
            show: true,
            success: false,
            message: "Error al guardar el producto"
          });
        }
      });
    };
  
    const [toast, setToast] = useState({
        show: false,
        success: false,
        message: "",
    });

    const openModal = () => setModalOpen(true);

    const openModalEdit = (area) => {
        setSelectedArea(area);
        setModalOpenEdit(true);
    }

    const closeModal = () => {
        setModalOpen(false);
        setModalOpenEdit(false)
    };

  useEffect(() => {
      router.visit(route('productos.index'), {
          preserveState: true,  // ← Clave para mantener la página actual
          only: ['productos'], // Solo recibir estos datos
          onSuccess: (res) => {
              setProductos(res.props.productos);
              setLoading(false);
          },
          onError: (err) => {
              console.error('Error:', err);
              setLoading(false);
          }
      });
  }, []);

  if (loading) return <p className="p-4">Cargando productos...</p>;

  


  


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        
        
        <div className="min-h-[100vh] md:min-h-min">
              <Button className={`${theme.bgHard} dark:${theme.bg} ${theme.bgHover} dark:${theme.bgHover} mb-4`} onClick={() => openModal()}>
                <ClipboardList  />
                Agregar nuevo producto
            </Button>
          <div className="border relative overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Tipo de producto</TableHeadCell>
                    <TableHeadCell>Tamaño</TableHeadCell>
                    <TableHeadCell>Colores</TableHeadCell>
                    <TableHeadCell>Cantidades</TableHeadCell>
                    <TableHeadCell>Descripcion</TableHeadCell>
                    <TableHeadCell >Editar Producto</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  <BTOList productos={productos}  openModal={openModalEdit}/>
                </TableBody>
              </Table>
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
                  onClose={closeModal} onSave={handleGuardarProducto}
                />
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
