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
      ticks: { color: '#6b7280' },
      grid: { color: '#e5e7eb', drawBorder: false },
    },
    x: {
      ticks: { color: '#6b7280' },
      grid: { display: false },
    },
  },
};

const labels = ['Soporte', 'Trámites', 'Retención', 'Móvil', 'Pruebas'];

const data = {
  labels,
  datasets: [
    {
      label: 'Llamadas',
      data: [85, 60, 45, 72, 30],
      backgroundColor: 'rgba(168, 85, 247, 0.6)',
      borderColor: 'rgba(147, 51, 234, 1)',
      borderWidth: 1,
      borderRadius: 10,
    },
  ],
};

export default function CallsPerOperationChart() {
  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Llamadas por operación</h3>
        <span className="text-sm text-gray-500">
          <Link className='text-purple-light-20' href={route('showOperationState')}>Hoy</Link>
        </span>
      </div>
      <Bar options={options} data={data} className="h-full w-full" />
    </div>
  );
}