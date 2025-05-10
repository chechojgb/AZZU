import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ListenRecords from '@/components/listenRecords'
import AdminActions from '@/components/adminActions';

const breadcrumbs = [
    {
        title: 'Administrar Agente',
        href: '/showTableAgents',
    },
];

const AgentControlPanel = ({ agent }) => {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="showTableAgents" />
        <div className="min-h-screen  text-gray-900 dark:text-white p-8 space-y-10">

      {/* Cabecera del agente */}
      

      <div className="flex items-center justify-between dark:bg-[#011111] border-l-4 border-green-500 px-6 py-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">👤</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h4 className="text-base font-semibold ">sergio</h4>
            <p className="text-sm ">1.1.1.1</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-green-600 font-medium text-sm">Busy</span>
          <div className="text-xs text-gray-400">10:00</div>
        </div>
      </div>


      {/* Sección de reproducción */}
      <ListenRecords />

      {/* Acciones disponibles */}
      <AdminActions />
    </div>


    </AppLayout>
  );
  
};

const ActionCard = ({ icon, label, color }) => (
    <button
      className={`flex flex-col items-center justify-center gap-2 py-6 rounded-xl shadow-md bg-${color}-600 hover:bg-${color}-700 text-white transition-all`}
    >
      <div className="text-3xl">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </button>
  );

export default AgentControlPanel;
