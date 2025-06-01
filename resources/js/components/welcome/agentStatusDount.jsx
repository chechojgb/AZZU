import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Link } from "@inertiajs/react";
import axios from "axios";
import DiscordLoader from '@/components/discordloader';
import { useLoadStatus } from "../context/loadContext";

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
  const [loading, setLoading] = useState(true);
  const [callData, setCallData] = useState({
    atendidas: 0,
    en_espera: 0,
    abandonadas: 0
  });
  const [selectedOperation, setSelectedOperation] = useState('');
  const { allLoaded, markLoaded } = useLoadStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/getDonutCalls');
        const responseData = res.data;

        setCallData({
          atendidas: responseData.data.atendidas || 0,
          en_espera: responseData.data.en_espera || 0,
          abandonadas: responseData.data.abandonadas || 0
        });

        setSelectedOperation(responseData.selectedOperation || '');
      } catch (err) {
        console.error('Error al obtener overview:', err);
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
    <div className="absolute inset-0 p-6 flex flex-col justify-between">
      {loading || !allLoaded ? (
        <DiscordLoader />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Estado de Llamadas {selectedOperation}
            </h3>
            <span className="text-sm text-gray-500">
              <Link className='text-purple-light-20' href={route('showCallState')}>Hoy</Link>
            </span>
          </div>

          <div className="flex items-center justify-center h-[60%]">
            <Doughnut data={chartData} options={options} />
          </div>

          <div className="divide-y mt-6">
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
