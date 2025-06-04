import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CallsPerOperationChart from '@/components/welcome/callPerOperationChart';
import { LoadProvider } from '@/components/context/loadContext';
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { useState, useEffect, React } from 'react';
import axios from 'axios';

const breadcrumbs = [
    {
        title: 'Llamadas en espera por operación',
        href: '/showOperationState',
    },
];

export default function CallsWaitingByOperation() {
    const [userOps, setUserOps] = useState([]);
    const [selectedOperation, setSelectedOperation] = useState(null);
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
            target: 'bg-blue-400 hover:bg-blue-500/80 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:border-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center z-50',
            item: {
                base: 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left z-50',
            },
        },
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Llamadas en espera por operación"/>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⏳ Llamadas en espera por operación</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                    Esta sección muestra la cantidad de llamadas actualmente en espera, segmentadas por cada operación. Permite identificar rápidamente las áreas con mayor demanda y tomar decisiones para optimizar la atención.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <LoadProvider total={1}>
                            <CallsPerOperationChart />
                        </LoadProvider>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow flex flex-col justify-between">
                        <div className="flex flex-col gap-2 mb-4">
                            <Dropdown label="Selecciona la operación" theme={customTheme}>
                                {userOps.map((op) => (
                                    <DropdownItem key={op} onClick={() => { startPolling(op); selectedOperation (op); }}>
                                    {op}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen de llamadas en espera</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Selecciona una operación para ver más detalles.
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center min-h-[80px] text-gray-400 dark:text-gray-500">
                            {!selectedOperation ? "Sin operación seleccionada" : `Opción seleccionada: ${selectedOperation}`}
                        </div>

                        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                            Última actualización: hace 5 minutos. Los datos se actualizan en tiempo real.
                        </div>
                    </div>
                </div>

               {!selectedOperation  ? (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Análisis detallado por operación</h2>
                        <div className="h-64 flex flex-col items-center justify-center text-center text-sm text-gray-400 dark:text-gray-500">
                            <p className="mb-2">Aún no has seleccionado una operación.</p>
                            <p>Selecciona una operación para ver información detallada sobre tiempos de espera y agentes conectados.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Columna 1: Tiempo promedio de espera */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">⏱️ Tiempo promedio de espera</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Promedio de espera actual en la operación <strong>{selectedOperation}</strong>.
                            </p>
                            {/* <AvgWaitTimeChart operation={selectedOperation} /> */}
                        </div>

                        {/* Columna 2: Agentes conectados */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">👥 Agentes conectados</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Lista de agentes activos y sus colas asignadas.
                            </p>
                            {/* <AgentsList operation={selectedOperation} /> */}
                        </div>
                    </div>
                )}


            </div>
        </AppLayout>
    );
}
