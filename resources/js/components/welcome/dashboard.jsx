import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import PrevTable from '@/components/welcome/prevTable';
import AlertasRecientesWidget from '@/components/welcome/agentAlertsPreview';
import AgentStatusDonut from '@/components/welcome/agentStatusDount';
import AgentRankingWidget from '@/components/welcome/agentRankingWidget';
import CallsPerOperationChart from '@/components/welcome/callPerOperationChart';
import MovimientosRecientesBL from '../BL/MovimientosRecientes';
import StockActualProductosBL from '../BL/StockActualProductosBL';
import RankingBotonesVendidosBL from '../BL/RankingBotonesVendidosBL';
import OrdenesPendientesBL from '../BL/OrdenesPendientesBL';
import GraficoProduccionSemanalBL from '../BL/GraficoProduccionSemanal';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({user, productos, pedidos, pedidosEspera, movimientos, produccion}) {    
    console.log('productos:',productos);
    
    // console.log('movimientos',movimientos);
        
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />
            <div className="flex flex-col flex-1 gap-4 rounded-xl p-4 min-h-screen">
                <div className=" text-sm">
                    Proyecto actual: <strong>{user.proyecto}</strong> (todos los datos mostrados son de ejemplo)
                </div>

                {user.proyecto === 'AZZU' && (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 flex-1">
                    {/* Panel 70% */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border min-h-[300px]">
                        <PrevTable/>
                    </div>

                    {/* Panel 30% */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border min-h-[300px]">
                        <AlertasRecientesWidget/>
                    </div>
                    </div>

                    <div className="grid auto-rows-fr gap-4 md:grid-cols-3 flex-1">
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border ">
                            <AgentStatusDonut/>
                        </div>
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                            <AgentRankingWidget/>
                        </div>
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border ">
                            <CallsPerOperationChart/>
                        </div>
                    </div>
                    </>
                ) }
                {user.proyecto === 'Button Lovers' && (
                     <>
                    <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 flex-1">
                    {/* Panel 70% */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border min-h-[300px]">
                        <GraficoProduccionSemanalBL produccion={produccion}/>
                    </div>

                    {/* Panel 30% */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border min-h-[300px]">
                        <MovimientosRecientesBL movimientos={movimientos}/>
                    </div>
                    </div>

                    <div className="grid auto-rows-fr gap-4 md:grid-cols-3 flex-1">
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border ">
                            <StockActualProductosBL productosStock={productos}/>
                        </div>
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                            <RankingBotonesVendidosBL pedidos={pedidos}/>
                        </div>
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border ">
                            <OrdenesPendientesBL ordenes={pedidosEspera}/>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
