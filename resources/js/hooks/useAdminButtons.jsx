
import {
  HiPhoneXMark,
  HiArrowRightCircle,
  HiPause,
  HiLockClosed,
  HiArrowPath,
  HiCheckCircle,
} from 'react-icons/hi2';

export default function useAdminButtons({ data, handlers }) {
  const notpaused = data?.member?.pausa === null;
  const paused = data?.member?.pausa != null;
  const notCall = data?.duration === null;

  const conditions = { notpaused, paused, notCall };

  const actions = [
    {
      label: 'Finalizar llamada',
      icon: <HiPhoneXMark className="w-5 h-5 text-red-600" />,
      bg: 'hover:bg-red-50 dark:hover:bg-red-400/60',
      border: 'border-red-200 dark:border-black',
      onClick: handlers.handleHangup,
      disabledIf: (c) => c.notCall,
    },
    {
      label: 'Transferir llamada',
      icon: <HiArrowRightCircle className="w-5 h-5 text-blue-500" />,
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-400/60',
      border: 'border-blue-200 dark:border-black',
      onClick: () => handlers.modal,
      disabledIf: (c) => c.notCall,
    },
    {
      label: 'Pausar agente',
      icon: <HiPause className="w-5 h-5 text-yellow-500" />,
      bg: 'hover:bg-yellow-50 dark:hover:bg-yellow-300/60',
      border: 'border-yellow-200 dark:border-black',
      onClick: handlers.handlePause,
      disabledIf: (c) => c.paused,
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
      onClick: handlers.handleUnpause,
      disabledIf: (c) => c.notpaused,
    },
  ];

  return { actions, conditions };
}
