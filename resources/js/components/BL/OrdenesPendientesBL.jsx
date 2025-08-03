import { Clock } from 'lucide-react';
import { useLoadStatus } from '../context/loadContext';
import { themeByProject } from '../utils/theme';
import { usePage } from '@inertiajs/react';

const ordenes = [
  {
    numero: 'ORD-1001',
    cliente: 'Confecciones Diana',
    fecha: '2025-08-02',
    estado: 'Pendiente',
  },
  {
    numero: 'ORD-1002',
    cliente: 'Boutique La Estrella',
    fecha: '2025-08-01',
    estado: 'Pendiente',
  },
  {
    numero: 'ORD-1003',
    cliente: 'Fábrica El Botonazo',
    fecha: '2025-07-31',
    estado: 'Pendiente',
  },
];

export default function OrdenesPendientesBL() {
    const { props } = usePage();
    const proyecto = props?.auth?.user?.proyecto || 'AZZU';
    const theme = themeByProject[proyecto];
  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Órdenes pendientes
      </h3>

      <ul className="space-y-4">
        {ordenes.map((orden, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
                
              <div className={`p-2 ${theme.bgSafe} ${theme.text} rounded-full`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">{orden.numero}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{orden.cliente}</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <p>{orden.fecha}</p>
              <p className={`${theme.text} font-semibold`}>{orden.estado}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
