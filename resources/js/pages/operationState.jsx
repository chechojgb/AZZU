import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CallsPerOperationChart from '@/components/welcome/callPerOperationChart';
import { LoadProvider } from '@/components/context/loadContext';
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { useState, useEffect, React } from 'react';
import axios from 'axios';
import { useLoadStatus } from '@/components/context/loadContext';
import { themeByProject } from '@/components/utils/theme';
import { usePage } from "@inertiajs/react";

import {
    Hourglass,
    Glasses,
    CircleDashed,
    CircleFadingPlus
} from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Llamadas en espera por operación',
        href: '/showOperationState',
    },
];

export default function CallsWaitingByOperation() {
    const [userOps, setUserOps] = useState([]);
    const [operation, setOperation] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [stats, setStats] = useState([]);
    const { props } = usePage();
    const proyecto = props?.auth?.user?.proyecto || 'AZZU';
    const theme = themeByProject[proyecto];



    const fetchStastOperation = (operation) => {
        if (!operation) return;

        fetch(`/api/operationState/${operation}`)
            .then(res => res.json())
            .then(data => {
            console.log('Datos crudos de la API:', data);
            setStats(data);
            })
            .catch(() => console.error('Error fetching stats'));
    }

    const fetchStastQueueOperation = (operation) => {
        if (!operation) return;

        fetch(`/api/operationQueueState/${operation}`)
            .then(res => res.json())
            .then(data => {
            console.log('Datos crudos de la API:', data);
            setStats(data);
            })
            .catch(() => console.error('Error fetching stats'));

        
    }

    const startPolling = (operation) => {
        // Limpia cualquier intervalo existente antes de iniciar uno nuevo
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        fetchStastOperation(operation); // Realiza la primera solicitud inmediatamente
        const intervalId = setInterval(() => {
            fetchStastOperation(operation);
        }, 8000);

        

        setPollingInterval(intervalId); // Guarda el identificador del intervalo
    };

    useEffect(() => {
        return () => {
            // Limpia el intervalo cuando el componente se desmonte
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    useEffect(() => {
    axios.get('/user/data')
        .then(res => setUserOps(res.data.operations))
        .catch(err => console.error('Error cargando operaciones', err));
    }, []);
    console.log('Operaciones asignadas:',userOps);

    const customTheme = {
        root: {
            base: 'relative inline-block text-left',
        },
        floating: {
            target: `${theme.bgHard} ${theme.bgHover}/80 focus:ring-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center z-50`,
            item: {
                base: 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left z-50',
            },
        },
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Llamadas en espera por operación"/>
            <div className="p-6 space-y-6">
                <h1 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 flex items-center gap-2"><Hourglass/> Llamadas en espera por operación</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                    Esta sección muestra la cantidad de llamadas actualmente en espera, segmentadas por cada operación. Permite identificar rápidamente las áreas con mayor demanda y tomar decisiones para optimizar la atención.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <LoadProvider total={1}>
                            <CallsPerOperationChart />
                        </LoadProvider>
                    </div>

                    <div className=" p-6 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border shadow-none flex flex-col justify-between h-full ">
                        <div className="flex flex-col gap-2 mb-4">
                            <Dropdown label="Selecciona la operación" theme={customTheme}>
                            {userOps.map((op) => (
                                <DropdownItem key={op} onClick={() => { startPolling(op); setOperation(op);  }}>
                                {op}
                                </DropdownItem>
                            ))}
                            </Dropdown>

    
                            {!operation ? 
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen de llamadas en espera</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Selecciona una operación para ver más detalles.
                                    </p>
                                </div> : ``
                            }
 
                        </div>
                        {!operation ? 
                            <div className="flex-1 flex items-center justify-center min-h-[80px] text-gray-400 dark:text-gray-500">
                                 Sin operación seleccionada
                            </div> : 
                            <div className="flex flex-col gap-2 mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                Desglose de llamadas y agentes por cola en la operación <strong>{operation}</strong>.
                                </p>
                            </div>
                        }
                        

                        <div className="max-h-[300px] overflow-y-auto space-y-4">

                            {stats.detalle_colas && stats.detalle_colas.map((cola) => (
                                <div key={cola.cola} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2"><CircleDashed className={`${theme.text}`}/> Cola {cola.cola}</h4>
                                        <span className="text-xs text-purple-500">{cola.llamadas} llamadas</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-gray-600 dark:text-gray-400 text-xs">
                                        <p>Total: <strong>{cola.agentes_totales}</strong></p>
                                        <p>Ocupados: <strong>{cola.agentes_ocupados}</strong></p>
                                        <p>Disponibles: <strong>{cola.agentes_disponibles}</strong></p>
                                    </div>
                                </div>
                            ))}
                        </div>
       

                            {/* <div className="p-3 rounded-lg border border-yellow-500 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">🌀 Cola Q29</h4>
                                    <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">5 llamadas</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-yellow-700 dark:text-yellow-400 text-xs">
                                    <p>Total: <strong>3</strong></p>
                                    <p>Ocupados: <strong>3</strong></p>
                                    <p>Disponibles: <strong>0</strong></p>
                                </div>
                            </div> */}

                        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                            Última actualización: Los datos se actualizan en tiempo real cada 8 segundos.
                        </div>
                    </div>

                </div>

               {!operation  ? (
                    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Glasses/> Análisis detallado por operación</h2>
                        <div className="h-64 flex flex-col items-center justify-center text-center text-sm text-gray-400 dark:text-gray-500">
                            <p className="mb-2">Aún no has seleccionado una operación.</p>
                            <p>Selecciona una operación para ver información detallada sobre tiempos de espera y agentes conectados.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Columna 1: Tiempo promedio de espera */}
                        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
                            <div className="flex flex-col items-start gap-2">
                            <p className="text-3xl font-semibold text-orange-500">01:38</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Promedio actual en la operación <strong>{operation}</strong>
                            </p>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                Máximo histórico hoy: 04:15 <br />
                                Objetivo ideal: ≤ 02:00
                            </div>
                            </div>
                        </div>

                        {/* Columna 2: Agentes conectados */}
                        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
                            <div className="flex flex-col gap-2">
  <p className="text-lg font-semibold text-gray-900 dark:text-white">9 agentes conectados</p>
  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
    <li>🟢 4 disponibles</li>
    <li>🔴 3 ocupados</li>
    <li>🟡 2 en pausa</li>
  </ul>
  <div className="mt-3">
    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Top 3 agentes activos</p>
    <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 list-disc ml-4">
      <li>Karol.Ospina — 18 llamadas</li>
      <li>David.Mendez — 14 llamadas</li>
      <li>Andrea.Sierra — 13 llamadas</li>
    </ul>
  </div>
</div>
                            {/* <AgentsList operation={selectedOperation} /> */}
                        </div>
                    </div>
                )}


            </div>
        </AppLayout>
    );
}
