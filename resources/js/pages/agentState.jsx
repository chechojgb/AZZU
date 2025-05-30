import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


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
          
        </AppLayout>
    );
}
