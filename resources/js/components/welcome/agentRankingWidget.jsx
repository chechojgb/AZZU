import { Link } from "@inertiajs/react";

const agentes = [
  { nombre: 'Ana P.', llamadas: 47, promedio: '2:38', rank: 1 },
  { nombre: 'Luis G.', llamadas: 44, promedio: '2:51', rank: 2 },
  { nombre: 'Jorge F.', llamadas: 42, promedio: '2:42', rank: 3 },
  { nombre: 'María C.', llamadas: 39, promedio: '3:02', rank: 4 },
  { nombre: 'Camilo Z.', llamadas: 37, promedio: '2:55', rank: 5 },
];

const getMedal = (rank) => {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `${rank}.`;
  }
};

export default function AgentRankingWidget() {
  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ranking de Agentes</h3>
        <span className="text-sm text-gray-500">
          <Link className='text-purple-light-20' href={route('showAgentRankingState')}>Hoy</Link>
        </span>
      </div>

      <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
        {agentes.map((agente, i) => (
          <li
            key={i}
            className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{getMedal(agente.rank)}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{agente.nombre}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Promedio: {agente.promedio}
                </p>
              </div>
            </div>
            <p  className="font-semibold text-purple-light-20">{agente.llamadas} llamadas</p>
          </li>
        ))}
      </ul>
    </div>
  );
}