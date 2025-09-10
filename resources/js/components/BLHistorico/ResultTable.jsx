// resources/js/components/BLHistorico/ResultTable.jsx
import { useState } from 'react';

const ResultTable = ({ datos, tipo, onActualizarEstado, mostrarAcciones = true }) => {
  const [seleccionados, setSeleccionados] = useState([]);

  const toggleSeleccion = (itemId) => {
    if (seleccionados.includes(itemId)) {
      setSeleccionados(seleccionados.filter(id => id !== itemId));
    } else {
      setSeleccionados([...seleccionados, itemId]);
    }
  };

  const completarSeleccionados = () => {
    if (seleccionados.length === 0) return;
    
    if (confirm(`¿Estás seguro de marcar ${seleccionados.length} item(s) como completado?`)) {
      seleccionados.forEach(itemId => {
        onActualizarEstado(itemId, 'completado');
      });
      setSeleccionados([]);
    }
  };

  // Filtrar solo items en proceso para la selección masiva
  const itemsEnProceso = datos.filter(item => item.estado === 'en proceso');

  if (datos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
        No hay items {getTipoTexto(tipo)}.
      </div>
    );
  }

  return (
    <div>
      {seleccionados.length > 0 && (
        <div className="mb-4 p-3 bg-blue-100 rounded-lg flex justify-between items-center">
          <span className="font-medium">{seleccionados.length} item(s) seleccionado(s)</span>
          <button
            onClick={completarSeleccionados}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium"
          >
            ✅ Completar seleccionados
          </button>
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-2xl">
        <table className="w-full text-xs sm:text-sm text-left text-gray-600 dark:text-gray-300">
          <thead className={`text-xs uppercase ${getColorEncabezado(tipo)}`}>
            <tr>
              {mostrarAcciones && (
                <th className="px-2 sm:px-4 py-2 sm:py-3 sticky top-0 bg-inherit z-10">
                  {itemsEnProceso.length > 0 && (
                    <input
                      type="checkbox"
                      checked={seleccionados.length === itemsEnProceso.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSeleccionados(itemsEnProceso.map(item => item.id));
                        } else {
                          setSeleccionados([]);
                        }
                      }}
                      className="w-4 h-4"
                    />
                  )}
                </th>
              )}
              <th className="px-2 sm:px-4 py-2 sm:py-3">Cliente</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Pedido</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Referencia</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Cantidad</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Nota</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3">Estado</th>
              {tipo !== 'pendientes' && <th className="px-2 sm:px-4 py-2 sm:py-3">Trabajador</th>}
              {tipo !== 'pendientes' && <th className="px-2 sm:px-4 py-2 sm:py-3">Fecha Marcación</th>}
            </tr>
          </thead>
          <tbody>
            {datos.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-b ${getColorFila(item.estado)} ${
                  idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                }`}
              >
                {mostrarAcciones && (
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    {item.estado === 'en_proceso' && (
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(item.id)}
                        onChange={() => toggleSeleccion(item.id)}
                        className="w-4 h-4"
                      />
                    )}
                  </td>
                )}
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.cliente}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.pedido}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.referencia}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.cantidad}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.nota}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getBadgeColor(item.estado)}`}>
                    {item.estado}
                  </span>
                </td>
                {tipo !== 'pendientes' && (
                  <td className="px-2 sm:px-4 py-2 sm:py-3">{item.trabajador || 'N/A'}</td>
                )}
                {tipo !== 'pendientes' && (
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    {item.fecha_marcacion ? new Date(item.fecha_marcacion).toLocaleDateString() : 'N/A'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

// Funciones auxiliares
const getTipoTexto = (tipo) => {
  const textos = {
    enProceso: 'en_proceso',
    completados: 'completado',
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

const getColorFila = (estado) => {
  const colores = {
    'pendiente': 'bg-blue-50 dark:bg-gray-800',
    'en_proceso': 'bg-yellow-50 dark:bg-gray-800',
    'completado': 'bg-green-50 dark:bg-gray-800',
    'marcado': 'bg-green-50 dark:bg-gray-800'
  };
  return colores[estado] || 'bg-white dark:bg-gray-800';
};

const getBadgeColor = (estado) => {
  const colores = {
    'pendiente': 'bg-gray-200 text-gray-800',
    'en_proceso': 'bg-yellow-200 text-yellow-800',
    'completado': 'bg-green-200 text-green-800',
    'marcado': 'bg-green-200 text-green-800'
  };
  return colores[estado] || 'bg-gray-200 text-gray-800';
};

export default ResultTable;