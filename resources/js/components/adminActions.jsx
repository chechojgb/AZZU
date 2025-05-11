import { useState } from 'react';
import React from 'react';
import hangupChannel from '@/components/actionsAgent/deleteCall'
import {
  HiPhoneXMark,
  HiArrowRightCircle,
  HiPause,
  HiLockClosed,
  HiArrowPath,
  HiCheckCircle
} from 'react-icons/hi2';
import { Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';




export default function AdminActions({ data }) {
  const [toast, setToast] = useState({ show: false, success: true, message: '' });
  const handleHangup = async () => {
  const result = await hangupChannel(data?.canal);
    setToast({
      show: true,
      success: result.success,
      message: result.message,
    });

    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const actions = [
    {
      label: 'Finalizar llamada',
      icon: <HiPhoneXMark className="w-5 h-5 text-red-600" />,
      bg: 'hover:bg-red-50 dark:hover:bg-red-400/60',
      border: 'border-red-200 dark:border-black',
      onClick: () => handleHangup(),
      disabledIf: (conditions) => conditions.notCall,
    },
    {
      label: 'Transferir llamada',
      icon: <HiArrowRightCircle className="w-5 h-5 text-blue-500" />,
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-400/60',
      border: 'border-blue-200 dark:border-black',
      onClick: () => alert('Transferir llamada'),
      disabledIf: (conditions) => conditions.notCall,
    },
    {
      label: 'Pausar agente',
      icon: <HiPause className="w-5 h-5 text-yellow-500" />,
      bg: 'hover:bg-yellow-50 dark:hover:bg-yellow-300/60',
      border: 'border-yellow-200 dark:border-black',
      onClick: () => alert('Pausar agente'),
      disabledIf: (conditions) => conditions.paused,
    },
    {
      label: 'Desloguear agente',
      icon: <HiLockClosed className="w-5 h-5 text-gray-500" />,
      bg: 'hover:bg-gray-50 dark:hover:bg-gray-400/60',
      border: 'border-gray-200 dark:border-black',
      onClick: () => alert('Desloguear agente'),
      disabledIf: () => false,
    },
    {
      label: 'Mover a cola',
      icon: <HiArrowPath className="w-5 h-5 text-indigo-500" />,
      bg: 'hover:bg-indigo-50 dark:hover:bg-indigo-400/60',
      border: 'border-indigo-200 dark:border-black',
      onClick: () => alert('Mover a cola'),
      disabledIf: () => false,
    },
    {
      label: 'Volver a disponible',
      icon: <HiCheckCircle className="w-5 h-5 text-green-500" />,
      bg: 'hover:bg-green-50 dark:hover:bg-green-400/60',
      border: 'border-green-200 dark:border-black',
      onClick: () => alert('Volver a disponible'),
      disabledIf: (conditions) => conditions.notpaused,
    },
  ];
  const isIpInvalid = ['(Unspecified)', null].includes(data?.ip);
  const isMemberAndIpNull = data?.ip === null && data?.member === null;
  const notpaused = data.member?.pausa === null; //Sirve para bloquear el volver a disponible porque ya lo esta
  const paused = data.member?.pausa != null; //Sirve para bloquear a pausar agente porque ya esta en pausa.
  const notCall = data?.duration === null; //Sirve para bloquear el finalizar llamada y transferir llamada porque no hay llamada activa

  const isUnspecified = isIpInvalid || isMemberAndIpNull;

  return (
    <div className="mt-6 space-y-4">
      {isUnspecified && (
        <div className="text-center text-red-600 font-semibold">
          Agente no conectado o IP no disponible.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
            const conditions = { notpaused, paused, notCall };
            const individuallyDisabled = action.disabledIf(conditions);
            const shouldDisable = isUnspecified || individuallyDisabled;

            return (
              <button
                key={index}
                onClick={shouldDisable ? null : action.onClick}
                disabled={shouldDisable}
                className={`flex items-center gap-4 p-4 
                  ${shouldDisable ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : `bg-gray-50 dark:bg-gray-900 ${action.bg}`} 
                  border ${shouldDisable ? '' : action.border} rounded-xl shadow transition-all hover:shadow-md`}
              >
                <div className={`p-2 rounded-full shadow-sm ring-1 ring-black/5 ${shouldDisable ? 'bg-gray-300' : 'bg-white'}`}>
                  {React.cloneElement(action.icon, {
                    className: shouldDisable ? 'w-5 h-5 text-gray-400' : action.icon.props.className
                  })}
                </div>
                <span className={`text-sm font-medium ${shouldDisable ? 'text-gray-500' : 'text-gray-700 dark:text-gray-100'}`}>
                  {action.label}
                </span>
              </button>
            );
          })}
          {toast.show && (
            <div className="fixed bottom-6 right-6 z-50">
              <Toast>
                <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  toast.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                }`}>
                  {toast.success ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>
              </Toast>
            </div>
          )}

      </div>
    </div>
  );
}
