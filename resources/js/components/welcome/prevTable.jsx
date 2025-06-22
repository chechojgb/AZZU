import { Link, usePage } from "@inertiajs/react";
import ButtonLarge from "@/components/button";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ButtonPurple from "@/components/buttonPurple";
import DiscordLoader from '@/components/discordloader';
import { useLoadStatus } from "../context/loadContext";
import { themeByProject } from '../utils/theme';

function PrevTable() {
    const { props } = usePage();
    const proyecto = props?.auth?.user?.proyecto || 'AZZU';
    const theme = themeByProject[proyecto];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { allLoaded, markLoaded } = useLoadStatus();
    const [error, setError] = useState(false);
    const intervalRef = useRef(null);
    
    useEffect(() => {
        const fetchData = () => {
            axios.get('/getOverview', { timeout: 5000 })
                .then(res => {
                    setData(res.data);
                    setLoading(false);
                    setError(false);
                    markLoaded();
                })
                .catch(err => {
                    console.error('Error al obtener overview:', err);
                    setError(true);
                    setLoading(false);
                    markLoaded();

                    // 🛑 Detiene el intervalo si hay error
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                });
        };

        fetchData();
        intervalRef.current = setInterval(fetchData, 8000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
    // console.log(data);

    return (
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {loading || !allLoaded ? (
                <DiscordLoader />
            ) : error ? (
                <div className={`${theme.text} text-center mt-10`}>
                    😓 Ups, no pudimos obtener datos del servidor.
                </div>
            ) 
            :(
                <>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agentes activos</h2>
                            <Link href={route('showTableAgents')}>
                                {/* <ButtonPurple content='Ver tabla completa'/> */}
                                <button className={`${theme.text} text-sm font-medium hover:underline  cursor-pointer`}>
                                    Ver tabla completa
                                </button>
                            </Link>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700 mb-4">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Nombre</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Extensión</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Conectado</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#011111] divide-y divide-gray-100 dark:divide-gray-700">
                                    {data.map(p => (
                                        <tr key={p.extension} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-4 py-2 text-gray-900 dark:text-white">{p.member?.nombre || 'Sin usuario'}</td>
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{p.extension}</td>
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{p.accountcode}</td>
                                            <td className="px-4 py-2">
                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 whitespace-nowrap">
                                                    <span className="text-sm">●</span>
                                                    Activo ({p.member?.estado || 'Desconocido'})
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default PrevTable;   