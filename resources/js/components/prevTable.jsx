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
                <h2 className="text-xl font-bold mb-4"> Agentes activos</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                        <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-2">Nombre</th>
                                <th className="px-4 py-2">Extensión</th>
                                <th className="px-4 py-2">Conectado</th>
                                <th className="px-4 py-2">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(p => <tr className="border-b border-gray-300 dark:border-gray-600" key={p.extension}>
                                <td className="px-4 py-2">{p.member.nombre}</td>
                                <td className="px-4 py-2">{p.extension}</td>
                                <td className="px-4 py-2">{p.accountcode}</td>
                                <td className="px-4 py-2 text-green-600 dark:text-green-400">● Activo ({p.member.estado})</td>
                                </tr>)}

                        </tbody>
                    </table>
                </div>
                <div className="text-right mt-4">
                    <Link href={route('showTableAgents')}  >
                        <ButtonLarge content="Ver tabla completa"/>
                    </Link>
                </div>
            </div>
    );
}

export default PrevTable;   