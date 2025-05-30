import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AgentStatusDonut from '@/components/welcome/agentStatusDount';


const breadcrumbs = [
    {
        title: 'Estado de las llamadas',
        href: '/showCallState',
    },
];

export default function TableAgents() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="showCallState" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📞 Estado de llamadas</h1>

                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                Esta sección presenta una vista detallada del comportamiento actual de las llamadas entrantes en el centro de contacto. Se muestra el total de llamadas atendidas, en espera y perdidas, permitiendo tomar decisiones rápidas para la gestión operativa.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <AgentStatusDonut />
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen de hoy</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Análisis breve del comportamiento actual. Ideal para una lectura rápida de la eficiencia en la atención.
                            </p>
                            </div>
                            <button className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                            <div className="w-4 h-4" /> Descargar PDF
                            </button>
                        </div>

                        <ul className="text-sm space-y-3 text-gray-700 dark:text-gray-300">
                            <li>
                            <span className="font-bold text-indigo-600">124</span> llamadas atendidas.
                            <span className="block text-xs text-gray-500 dark:text-gray-400">Esto indica una buena capacidad de respuesta general.</span>
                            </li>
                            <li>
                            <span className="font-bold text-green-600">32</span> llamadas en espera.
                            <span className="block text-xs text-gray-500 dark:text-gray-400">Puede requerirse más personal en determinadas franjas horarias.</span>
                            </li>
                            <li>
                            <span className="font-bold text-red-600">18</span> llamadas perdidas.
                            <span className="block text-xs text-gray-500 dark:text-gray-400">Esto representa un riesgo en la atención al cliente que debe mitigarse.</span>
                            </li>
                        </ul>

                        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                            Última actualización: hace 5 minutos. Los datos se actualizan en tiempo real.
                        </div>
                        </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Evolución por hora</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Este gráfico mostrará cómo varía el flujo de llamadas a lo largo del día, ayudando a identificar picos de demanda y a organizar turnos de forma eficiente.
                </p>
                <div className="h-64 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                    [ Aquí se mostraría una gráfica de líneas por hora ]
                </div>
                </div>
            </div>
        </AppLayout>
    );
}
