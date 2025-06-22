import { useState, useEffect,useRef  } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Link,usePage} from "@inertiajs/react";
import axios from "axios";
import DiscordLoader from '@/components/discordloader';
import { useLoadStatus } from "../context/loadContext";
import { themeByProject } from '../utils/theme';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#6b7280',
      },
    },
  },
  cutout: '70%',
};

export default function AgentStatusDonut() {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [callData, setCallData] = useState({
    atendidas: 0,
    en_espera: 0,
    abandonadas: 0
  });
  const [selectedOperation, setSelectedOperation] = useState('');
  const { allLoaded, markLoaded } = useLoadStatus();

  console.log(theme);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/getDonutCalls', {timeout: 5000});
        const responseData = res.data;

        setCallData({
          atendidas: responseData.data.atendidas || 0,
          en_espera: responseData.data.en_espera || 0,
          abandonadas: responseData.data.abandonadas || 0
        });

        setSelectedOperation(responseData.selectedOperation || '');
      } catch (err) {
        console.error('Error al obtener overview:', err);
        setError(true);
      } finally {
        setLoading(false);
        markLoaded(); // 🎯 indicamos que este componente terminó
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Llamadas atendidas', 'Llamadas en espera', 'Llamadas perdidas'],
    datasets: [
      {
        label: 'Llamadas',
        data: [callData.atendidas, callData.en_espera, callData.abandonadas],
        backgroundColor: [
          'rgba(147, 51, 234, 1)',     // atendidas
          'rgba(16, 185, 129, 0.8)',   // en espera
          'rgba(239, 68, 68, 0.8)'     // abandonadas
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-full min-h-[360px] p-6 flex flex-col gap-4">
    {loading || !allLoaded ? (
      <DiscordLoader />
    ) : (
      <>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Estado de Llamadas {selectedOperation}
          </h3>
          <span className="text-sm text-gray-500">
            <Link className={`${theme.text}`} href={route('showCallState')}>Hoy</Link>
          </span>

          
        </div>
        <div>
          {error && (
            <div className={`${theme.text} text-center mt-4`}>
              😓 Ups, no pudimos obtener datos del servidor.
            </div>
          )}
        </div>

        {/* Donut Chart con espacio controlado */}
        <div className="flex-grow flex items-center justify-center max-h-[220px]">
          <Doughnut data={chartData} options={options} />
        </div>

        {/* Detalles */}
        <div className="divide-y">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
              <span className="text-sm text-gray-700 dark:text-gray-200">Atendidas</span>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {callData.atendidas}
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              <span className="text-sm text-gray-700 dark:text-gray-200">En espera</span>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {callData.en_espera}
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600"></span>
              <span className="text-sm text-gray-700 dark:text-gray-200">Perdidas</span>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {callData.abandonadas}
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  );
}
