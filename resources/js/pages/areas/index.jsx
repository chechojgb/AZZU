import { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AreaList from '@/components/areaList';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import UserInfoList from '@/components/userInfoList';
import { Button } from "flowbite-react";
import { HiOutlineArrowRight, HiShoppingCart } from "react-icons/hi";
import { ClipboardList } from 'lucide-react';
import AgentModalWrapper from '@/components/agentsModalWrapper';
import AreaModalContent from '@/components/areaModalContent';
import AreaModalEditContent from '@/components/areaModalEditContent';
import { HiCheck, HiX } from "react-icons/hi";
import { Toast } from "flowbite-react";
// import { log } from 'node:console';

const breadcrumbs = [
  { title: 'Usuarios activos', href: '/users' },
];

export default function Areas() {
    const [areas, setAreas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenEdit, setModalOpenEdit] = useState(false);
    const [totalAreas, setTotalAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
  
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
    axios.get('areas/index')
      .then(res => {
        setAreas(res.data.areas);
        setTotalAreas(res.data.totalAreas)
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar las areas:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Cargando usuarios...</p>;

  
  console.log('Total de areas:',totalAreas);
  console.log('Areas:', areas);
  


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        
        <UserInfoList data={areas}/>
        <div className="min-h-[100vh] md:min-h-min">
            <Button className='bg-purple-light-20 mb-4 ' onClick={() => openModal()}>
                <ClipboardList  />
                Crear nueva area
            </Button>
          <div className="border relative overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Nombre</TableHeadCell>
                    <TableHeadCell>Creada</TableHeadCell>
                    <TableHeadCell>Actualizada</TableHeadCell>
                    <TableHeadCell>Editar usuario</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  <AreaList areas={areas} totalAreas={totalAreas} openModal={openModalEdit}/>
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
                <AreaModalContent  onClose={closeModal} setToast={setToast} />
            </AgentModalWrapper>
        )}

        {modalOpenEdit && (
            <AgentModalWrapper closeModal={closeModal}>
                <AreaModalEditContent  onClose={closeModal} setToast={setToast} area={selectedArea}/>
            </AgentModalWrapper>
        )}
    </AppLayout>
  );
}
