import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


const breadcrumbs = [
    {
        title: 'Estado de las operaciones',
        href: '/showOperationState',
    },
];

export default function TableAgents() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="showOperationState"/>
          
        </AppLayout>
    );
}
