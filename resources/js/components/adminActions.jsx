//ESTE COMPONENTE ES MUY IMPORTANTE ENTENDER SU MODULARIZACION  PARA PODER HACERLE  MANTENIMIENTO, DENTRO DE ESTE COMPONENTE RECIBIMOS LA INFORMACION DEL AGENTE EN LA VARIABLE $data EL CUAL SE REPARTE EN 3 COMPONENTES  MAS 

// 1.0 ESTA SECCION DEL COMPONENTE LO QUE HACE ES VALIDAR UNA INFORMACION QUE NOS DA UN STATUS SOBRE EL AGENTE, ESTE NOS SIRVE PARA SABER SI TIENE UNA IP ACTIVA O ALMENOS ESTA EN USO,  TODO ESTO PARA PREVENIR EL USO DE  LOS BOTONES CON AGENTES QUE NO LO REQUIEREN.
// 1.1 ESTA SECCION HACE UN LLAMADO A DOS COSAS
//   -EL VALIDADOR SI EXISTE EL AGENTE
//   -EL COMPONENTE QUE MAPEA  LOS BOTONES. ESTE BOTON LE PASAMOS LAS PROPIEDAS COMO COLORES O ACCIONES JUNTO CON SU IDENTIFICADOR.

// 1.3 ESTA SECCION VIENE DE LA MANO DEL ONCLICK DEL COMPONENTE DEL BOTON, LO QUE ESTA HACIENDO ES UNA  VALIDACION SI EXISTE EN ESE MOMENTO UN TOAST, SI ES ASI MUESTRA LOS DATOS QUE DEVUELVE EL API 

// 1.4 PARA QUE FUNCIONE O OBTENGAMOS LOS DATOS QUE QUEREMOS EN EL MAPEO DEL COMPONENTE DEL BOTON LO RECIBIMOS DE UN HOOK LLAMADO useAdminHandlers  ESTOS GENERAN OTRAS ACCIONES QUE PODEMOS VER EN ESE COMPONENTE


import useAdminHandlers from '@/hooks/useAdminHandlers';
import useAdminModal from '@/hooks/useAdminModal';
import useAdminButtons from '@/hooks/useAdminButtons';
import { Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';
import AdminActionButton from './adminActionButton';
import AgentModalWrapper from '@/components/agentsModalWrapper';
import TransferModal from './transferModal';
import { useState } from 'react';

export default function AdminActions({ data }) {

  const isIpInvalid = ['(Unspecified)', null].includes(data?.ip);
  const isMemberAndIpNull = data?.ip === null && data?.member === null;
  const isUnspecified = isIpInvalid || isMemberAndIpNull;
  const { modal, showModal, hideModal } = useAdminModal();
  const handlers = useAdminHandlers(data);
  // 1.4 llamado acciones del boton
  const { actions, conditions } = useAdminButtons({ data, handlers });


  return (
    <div className="mt-6 space-y-4">
      {/* 1.0 VALIDACION AGENTE */}
      {isUnspecified && (
        <div className="text-center text-red-600 font-semibold">
          Agente no conectado o IP no disponible.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/*1.1 MAPEO DE BOTONES */}
        {actions.map((action, index) => {
          const disabled =  isUnspecified || action.disabledIf(conditions);
          return (
            <AdminActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.label === 'Transferir llamada' ? () => showModal() : action.onClick}
              disabled={disabled}
              bg={action.bg}
              border={action.border}
            />
          );
        })}
      </div>
        {/* 1.3 MOSTRAR TOATS */}
      {handlers.toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                handlers.toast.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
              }`}
            >
              {handlers.toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{handlers.toast.message}</div>
          </Toast>
        </div>
      )}

      {modal.show && (
        <AgentModalWrapper closeModal={hideModal}>
          <TransferModal
            hideModal={hideModal}
            handlers={handlers}
          />
        </AgentModalWrapper>
      )}



    </div>
  );
}
 