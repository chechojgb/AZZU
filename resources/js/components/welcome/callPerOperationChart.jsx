import { Link } from "@inertiajs/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { useLoadStatus } from "../context/loadContext";
import DiscordLoader from '@/components/discordloader';
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#111827',
      titleColor: '#fff',
      bodyColor: '#d1d5db',
    },
  },
  scales: {
    y: {
      min: 0,
      max: 50, 
      ticks: {
        stepSize: 10, 
        color: '#6b7280',
      },
      grid: {
        color: '#e5e7eb',
        drawBorder: false,
      },
    },
    x: {
      ticks: { color: '#6b7280' },
      grid: { display: false },
    },
  },
};

const labels = ['Soporte', 'Trámites', 'Retención', 'Móvil', 'Pruebas'];

export default function CallsPerOperationChart() {
  const [loading, setLoading] = useState(true);
  const { allLoaded, markLoaded } = useLoadStatus();
  const [callData, setCallData] = useState({
    Soporte: 0,
    Tramites: 0,
    Retencion: 0,
    Movil: 0,
    Pruebas: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/getCallsPerOperation');
        const result = res.data;

        setCallData({
          Soporte: result.Soporte || 0,
          Tramites: result.Tramites || 0,
          Retencion: result.Retencion || 0,
          Movil: result.Movil || 0,
          Pruebas: result.Pruebas || 0
        });
      } catch (err) {
        console.error('Error al obtener llamadas por operación:', err);
      } finally {
        setLoading(false);
        markLoaded();
      }
    };
    fetchData();

    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval); 
  }, []);

  console.log(callData);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Llamadas',
        data: [
          callData.Soporte,
          callData.Tramites,
          callData.Retencion,
          callData.Movil,
          callData.Pruebas
        ],
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-between">
      {!allLoaded ? (
        <DiscordLoader />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Llamadas por operación</h3>
            <span className="text-sm text-gray-500">
              <Link className='text-purple-light-20' href={route('showOperationState')}>Hoy</Link>
            </span>
          </div>
          <Bar options={options} data={chartData} className="h-full w-full" />
        </>
      )}
    </div>
  );
}
