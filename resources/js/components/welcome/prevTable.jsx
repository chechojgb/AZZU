import { Link } from "@inertiajs/react";
import ButtonLarge from "@/components/button";
import { useState, useEffect } from "react";
import axios from "axios";

function PrevTable() {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = () => {
            axios.get('/api/getOverview')
                .then(res=> setData(res.data))
                .catch(err => console.error('Error al obtener overview:', err));
        }

        fetchData();

        const interval = setInterval(fetchData, 8000);
        
        return () => clearInterval(interval);
        
    }, []);
    console.log(data);

    return (
        <div className="h-full w-full bg-white dark:bg-[#011111] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agentes activos</h2>
                <Link href={route('showTableAgents')}>
                <ButtonLarge content="Ver tabla completa" />
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
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
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                            ● Activo ({p.member?.estado || 'Desconocido'})
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
}

export default PrevTable;   