import { useEffect, useState } from "react";
import axios from "axios";
import DiscordLoader from '@/components/discordloader';
import { useLoadStatus } from "../context/loadContext";
import { Link, usePage } from "@inertiajs/react";
import { themeByProject } from '../utils/theme';


const getMedal = (rank) => {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `${rank}.`;
  }
};

export default function AgentRankingWidget() {
  const { props } = usePage();
  const proyecto = props?.auth?.user?.proyecto || 'AZZU';
  const theme = themeByProject[proyecto];
  const [agentes, setAgentes] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { allLoaded, markLoaded } = useLoadStatus();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await axios.get('/getAgentRanking');

        if (Array.isArray(res.data.data)) {
          const ordenados = res.data.data
            .sort((a, b) => b.total_llamadas - a.total_llamadas)
            .map((agente, index) => ({ ...agente, rank: index + 1 }));

          setAgentes(ordenados);
        } else {
          console.warn("La respuesta no contiene un array de datos:", res.data);
        }
      } catch (error) {
        console.error("Error al obtener ranking de agentes", error);
      } finally {
        setLoading(false); 
        markLoaded();  
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="p-6 flex flex-col justify-between">
      {loading || !allLoaded ? ( // ⛳ doble condición: hasta que TODOS estén listos
        <DiscordLoader />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ranking de Agentes</h3>
            <span className="text-sm text-gray-500">
              <Link className={`${theme.text}`} href={route('showAgentRankingState')}>Hoy</Link>
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
                    <p className="font-medium text-gray-900 dark:text-white">{agente.agente}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Directas: {agente.directas}, Transferidas: {agente.transferidas}
                    </p>
                  </div>
                </div>
                <p className={`${theme.textSafe} font-semibold`}>{agente.total_llamadas} llamadas</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
