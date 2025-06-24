import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AgentRankingWidget from '@/components/welcome/agentRankingWidget';
import { LoadProvider } from '@/components/context/loadContext';

const breadcrumbs = [
    {
        title: 'Ranking de agentes',
        href: '/showAgentsState',
    },
];

export default function TableAgents() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="showAgentsState" />
            {/* import debug from 'debug'; */}
            <div className="p-8 space-y-8  min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-indigo-800 dark:text-white mb-2">🏆 Ranking de Agentes</h1>
                        <p className="text-base text-gray-700 dark:text-gray-300 max-w-xl">
                            Descubre el desempeño de cada agente en tiempo real. Analiza quiénes lideran en eficiencia, llamadas atendidas y calidad de servicio.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
                            Exportar Ranking
                        </button>
                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">
                            Configurar Vista
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
                        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">Tabla de Ranking</h2>
                        <div className="flex-1">
                            <LoadProvider total={1}>
                                <AgentRankingWidget />
                            </LoadProvider>
                        </div>
                    </div>
                    <div className="from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between">

                </div>

                <div className=" rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 mt-8">
                    <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">📈 Evolución Horaria</h2>
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                        Visualiza el comportamiento de las llamadas a lo largo del día para identificar tendencias y optimizar recursos.
                    </p>
                    <div className="h-64 flex items-center justify-center text-lg text-gray-400 dark:text-gray-500 italic">
                        [ Aquí se mostrará la gráfica de evolución por hora ]
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
