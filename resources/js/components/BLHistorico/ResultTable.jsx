// resources/js/components/BLHistorico/ResultTable.jsx
const ResultTable = ({ datos, tipo }) => {
  if (datos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
        No hay items {getTipoTexto(tipo)}.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-2xl">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className={`text-xs uppercase ${getColorEncabezado(tipo)}`}>
          <tr>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Referencia</th>
            <th className="px-4 py-3">Cantidad</th>
            <th className="px-4 py-3">Nota</th>
            {tipo !== 'pendientes' && <th className="px-4 py-3">Trabajador</th>}
            {tipo !== 'pendientes' && <th className="px-4 py-3">Fecha Marcación</th>}
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => (
            <tr key={item.id} className={`border-b ${getColorFila(tipo)}`}>
              <td className="px-4 py-3">{item.cliente}</td>
              <td className="px-4 py-3">{item.pedido}</td>
              <td className="px-4 py-3">{item.referencia}</td>
              <td className="px-4 py-3">{item.cantidad}</td>
              <td className="px-4 py-3">{item.nota}</td>
              {tipo !== 'pendientes' && <td className="px-4 py-3">{item.trabajador}</td>}
              {tipo !== 'pendientes' && (
                <td className="px-4 py-3">
                  {new Date(item.fecha_marcacion).toLocaleDateString()}
                </td>
              )}
              <td className="px-4 py-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Funciones auxiliares
const getTipoTexto = (tipo) => {
  const textos = {
    enProceso: 'en proceso',
    completados: 'completados',
    pendientes: 'pendientes',
    todos: ''
  };
  return textos[tipo] || '';
};

const getColorEncabezado = (tipo) => {
  const colores = {
    enProceso: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800',
    completados: 'bg-green-100 text-green-800 dark:bg-green-800',
    pendientes: 'bg-blue-100 text-blue-800 dark:bg-blue-800',
    todos: 'bg-gray-100 text-gray-800 dark:bg-gray-700'
  };
  return colores[tipo] || 'bg-gray-100 text-gray-800 dark:bg-gray-700';
};

const getColorFila = (tipo) => {
  const colores = {
    enProceso: 'bg-yellow-50 dark:bg-gray-800',
    completados: 'bg-green-50 dark:bg-gray-800',
    pendientes: 'bg-blue-50 dark:bg-gray-800',
    todos: 'bg-white dark:bg-gray-800'
  };
  return colores[tipo] || 'bg-white dark:bg-gray-800';
};

export default ResultTable;