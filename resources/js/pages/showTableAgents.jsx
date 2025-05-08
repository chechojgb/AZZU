import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AgentPanel from '@/components/tableAgents';
import PrevTable from '@/components/prevTable';

const breadcrumbs = [
    {
        title: 'Tabla de agentes',
        href: '/showTableAgents',
    },
];

export default function TableAgents() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="showTableAgents" />
            <AgentPanel/>
        </AppLayout>
    );
}
