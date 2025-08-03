import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const movimientos = [
  {
    tipo: 'Entrada',
    producto: 'Botón Z6',
    cantidad: 500,
    fecha: '2025-08-02',
    icono: <ArrowDownCircle className="text-green-600 w-5 h-5" />,
  },
  {
    tipo: 'Salida',
    producto: 'Botón R4',
    cantidad: 300,
    fecha: '2025-08-02',
    icono: <ArrowUpCircle className="text-red-600 w-5 h-5" />,
  },
  {
    tipo: 'Entrada',
    producto: 'Botón L2',
    cantidad: 200,
    fecha: '2025-08-01',
    icono: <ArrowDownCircle className="text-green-600 w-5 h-5" />,
  },
  {
    tipo: 'Salida',
    producto: 'Botón M1',
    cantidad: 100,
    fecha: '2025-07-31',
    icono: <ArrowUpCircle className="text-red-600 w-5 h-5" />,
  },
  {
    tipo: 'Entrada',
    producto: 'Botón Z1',
    cantidad: 200,
    fecha: '2025-08-01',
    icono: <ArrowDownCircle className="text-green-600 w-5 h-5" />,
  },
  {
    tipo: 'Entrada',
    producto: 'Botón Z1',
    cantidad: 1000,
    fecha: '2025-08-02',
    icono: <ArrowDownCircle className="text-green-600 w-5 h-5" />,
  },
  // Puedes duplicar más para probar el scroll
];

export default function MovimientosRecientesBL() {
  return (
    <div className="relative flex flex-col h-full p-5">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Movimientos recientes
      </h3>

      {/* Lista scrollable */}
      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="space-y-4 text-sm text-gray-800 dark:text-gray-300">
          {movimientos.map((mov, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                  {mov.icono}
                </div>
                <div>
                  <p className="font-medium">{mov.tipo}: {mov.producto}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cantidad: {mov.cantidad}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{mov.fecha}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
