import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Llamadas atendidas', 'Llamadas en espera', 'Llamadas perdidas'],
  datasets: [
    {
      label: 'Llamadas',
      data: [124, 32, 18],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 1,
    },
  ],
};

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
  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estado de Llamadas</h3>
        <span className="text-sm text-gray-500">Hoy</span>
      </div>

      <div className="flex items-center justify-center h-[60%]">
        <Doughnut data={data} options={options} />
      </div>

      <div className="divide-y mt-6">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
            <span className="text-sm text-gray-700 dark:text-gray-200">Atendidas</span>
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">124 <span className="ml-2 text-xs text-indigo-600">+0.2%</span></div>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            <span className="text-sm text-gray-700 dark:text-gray-200">En espera</span>
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">32 <span className="ml-2 text-xs text-emerald-600">-0.7%</span></div>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-sm text-gray-700 dark:text-gray-200">Perdidas</span>
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">18 <span className="ml-2 text-xs text-red-600">+0.4%</span></div>
        </div>
      </div>
    </div>
  );
}
