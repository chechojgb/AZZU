import { Link,usePage } from "@inertiajs/react";
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
import { useEffect, useState, useRef } from 'react';
import DiscordLoader from '@/components/discordloader';
import axios from "axios";
import { useLoadStatus } from "../context/loadContext";
import { themeByProject, getChartColors } from '../utils/theme';
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
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [loading, setLoading] = useState(true);
  const { allLoaded, markLoaded } = useLoadStatus();
  const chartColors = getChartColors(proyecto);
  const [error, setError] = useState(false);
  const intervalRef = useRef(null);

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
        const res = await axios.get('/api/getCallsPerOperation', { timeout: 5000 });
        const result = res.data;

        setCallData({
          Soporte: result.Soporte || 0,
          Tramites: result.Tramites || 0,
          Retencion: result.Retencion || 0,
          Movil: result.Movil || 0,
          Pruebas: result.Pruebas || 0
        });

        setError(false); // ✅ Limpia el error si todo salió bien
      } catch (err) {
        console.error('Error al obtener llamadas por operación:', err);
        setError(true); // ✅ Marca que hay error
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // 🔥 Detiene el polling
        }
      } finally {
        setLoading(false);
        markLoaded();
      }
    };

    fetchData();
    intervalRef.current = setInterval(fetchData, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // 🧹 Limpieza segura
      }
    };
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
        backgroundColor: chartColors.fill,
        borderColor: chartColors.border,
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="px-4 py-3 sm:px-6 sm:py-4 flex flex-col justify-between h-full">
      {!allLoaded ? (
        <DiscordLoader />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Llamadas por operación</h3>
            <span className="text-sm text-gray-500">
              <Link className={`${theme.text}`} href={route('showOperationState')}>Hoy</Link>
            </span>
          </div>
          <div>
            <div>
              {error && (
                <div className={`${theme.text} text-center mt-4`}>
                  😓 Ups, no pudimos obtener datos del servidor.
                </div>
              )}
            </div>
          </div>
          <Bar options={options} data={chartData} className="h-full w-full" />
        </>
      )}
    </div>
  );
}
