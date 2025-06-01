import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js';
import { Clock, PhoneMissed, AlertTriangle } from 'lucide-react';
import DiscordLoader from '@/components/discordloader';
import { useLoadStatus } from '../context/loadContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

const alerts = [
  {
    icon: <Clock size={16} />, 
    title: 'Julio G. en pausa',
    detail: 'Hace 32 minutos',
    date: 'Hoy',
    time: '09:22 AM'
  },
  {
    icon: <PhoneMissed size={16} />, 
    title: 'Llamada en espera',
    detail: 'Desde hace 2:15 min',
    date: 'Hoy',
    time: '09:25 AM'
  },
  {
    icon: <AlertTriangle size={16} />, 
    title: 'Ext. 2039 desconectada',
    detail: 'Inesperadamente',
    date: 'Hoy',
    time: '09:10 AM'
  },
];

const data = {
  labels: ['6:00', '7:00', '8:00', '9:00', '10:00'],
  datasets: [
    {
      label: 'Alertas por hora',
      data: [1, 3, 2, 5, 4],
      fill: true,
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgba(147, 51, 234, 1)',
      tension: 0.4,
    },
  ],
};

const options = {
  plugins: { legend: { display: false } },
  scales: {
    y: { display: false },
    x: { ticks: { color: '#888' }, grid: { display: false } },
  },
};

export default function AlertasRecientesWidget() {
  const [loading, setLoading] = useState(true);
  const { allLoaded, markLoaded } = useLoadStatus();

  useEffect(() => {
    // Simula una carga real
    const timer = setTimeout(() => {
      setLoading(false);
      markLoaded(); // marcar este componente como cargado
    }, 800); // puedes ajustar este tiempo si lo deseas

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5">
      {loading || !allLoaded ? (
        <DiscordLoader />
      ) : (
        <>
          {/* Encabezado */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alertas recientes</h3>
              <button className="text-xs text-cyan-600 hover:underline">Ver todo</button>
            </div>

            {/* Lista */}
            <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              {alerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="bg-purple-100 text-purple-600 rounded-full p-1">{alert.icon}</div>
                    {i < alerts.length - 1 && <div className="h-full w-px bg-gray-300 dark:bg-gray-600 mt-1" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{alert.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{alert.detail}</p>
                  </div>
                  <div className="text-xs text-right text-gray-500 dark:text-gray-400">
                    <p>{alert.date}</p>
                    <p>{alert.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Gráfico */}
          <div className="mt-4">
            <Line data={data} options={options} height={80} />
          </div>
        </>
      )}
    </div>
  );
}
