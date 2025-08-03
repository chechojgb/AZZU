import { Medal } from 'lucide-react';

const botonesVendidos = [
  { nombre: 'Botón Z6', cantidad: 1200 },
  { nombre: 'Botón R4', cantidad: 950 },
  { nombre: 'Botón M1', cantidad: 800 },
  { nombre: 'Botón L2', cantidad: 650 },
  { nombre: 'Botón N8', cantidad: 500 },
];

const coloresRanking = ['text-yellow-500', 'text-gray-400', 'text-orange-700'];

export default function RankingBotonesVendidosBL() {
  return (
    <div className="relative p-4 h-full">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Ranking de botones más vendidos
      </h3>

      <div className="overflow-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-2 pr-4 font-medium">#</th>
              <th className="py-2 pr-4 font-medium">Producto</th>
              <th className="py-2 text-right font-medium">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {botonesVendidos.map((boton, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'bg-white dark:bg-gray-900'
                } border-l-4 ${
                  index < 3
                    ? `border-l-${coloresRanking[index].split('-')[1]}-400`
                    : 'border-transparent'
                }`}
              >
                <td className="py-2 pr-4 pl-2">
                  {index < 3 ? (
                    <Medal
                      size={16}
                      className={`${coloresRanking[index]} inline-block mr-1`}
                    />
                  ) : (
                    <span className="text-gray-400">{index + 1}</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-gray-800 dark:text-gray-100">
                  {boton.nombre}
                </td>
                <td className="py-2 text-right text-gray-700 dark:text-gray-300">
                  {boton.cantidad} u
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
