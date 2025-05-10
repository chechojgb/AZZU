import {
    HiPhoneXMark,         // reemplazo de PhoneMissedCall
    HiArrowRightCircle,
    HiPause,
    HiLockClosed,
    HiArrowPath,
    HiCheckCircle
  } from 'react-icons/hi2';
  
  const actions = [
    {
      label: 'Finalizar llamada',
      icon: <HiPhoneXMark className="w-5 h-5 text-red-600" />,
      bg: 'hover:bg-red-50 dark:hover:bg-red-400/60',
      border: 'border-red-200 dark:border-black',
      onClick: () => alert('Finalizar llamada'),
    },
    {
      label: 'Transferir llamada',
      icon: <HiArrowRightCircle className="w-5 h-5 text-blue-500" />,
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-400/60',
      border: 'border-blue-200 dark:border-black',
      onClick: () => alert('Transferir llamada'),
    },
    {
      label: 'Pausar agente',
      icon: <HiPause className="w-5 h-5 text-yellow-500" />,
      bg: 'hover:bg-yellow-50 dark:hover:bg-yellow-300/60',
      border: 'border-yellow-200 dark:border-black',
      onClick: () => alert('Pausar agente'),
    },
    {
      label: 'Desloguear agente',
      icon: <HiLockClosed className="w-5 h-5 text-gray-500" />,
      bg: 'hover:bg-gray-50 dark:hover:bg-gray-400/60',
      border: 'border-gray-200 dark:border-black',
      onClick: () => alert('Desloguear agente'),
    },
    {
      label: 'Mover a cola',
      icon: <HiArrowPath className="w-5 h-5 text-indigo-500" />,
      bg: 'hover:bg-indigo-50 dark:hover:bg-indigo-400/60',
      border: 'border-indigo-200 dark:border-black',
      onClick: () => alert('Mover a cola'),
    },
    {
      label: 'Volver a disponible',
      icon: <HiCheckCircle className="w-5 h-5 text-green-500" />,
      bg: 'hover:bg-green-50 dark:hover:bg-green-400/60',
      border: 'border-green-200 dark:border-black',
      onClick: () => alert('Volver a disponible'),
    },
  ];
  
  export default function AdminActions() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border ${action.border} rounded-xl shadow transition-all hover:shadow-md ${action.bg}`}
          >
            <div className="p-2 bg-white rounded-full shadow-sm ring-1 ring-black/5">
              {action.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-100">{action.label}</span>
          </button>
        ))}
      </div>
    );
  }
  