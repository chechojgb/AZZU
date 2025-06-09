// ModalColasAgent.jsx
import React from 'react';
import {
    Glasses,
} from 'lucide-react';
function ModalColasAgent({ titulo = "Agentes", usuarios = [], tipo }) {
    const estadoColorMap = {
    disponibles: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    ocupados: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    en_pausa: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    };

    const badgeClass = `text-xs font-semibold px-3 py-1 rounded-full ${estadoColorMap[tipo] ?? ''}`;
  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <Glasses/> {titulo} ({usuarios.length})
      </h2>

      {usuarios.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No hay agentes en este estado.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {usuarios.map((agente, idx) => (
            <li key={idx} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    👤 {agente.usuario}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Extensión: <strong>{agente.extension}</strong>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Colas asignadas:{" "}
                    <span className="font-semibold">{agente.colas.join(", ")}</span>
                  </p>
                </div>
                <span className={badgeClass}>
                    {agente.estado}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ModalColasAgent;
