
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AgentPanel from '@/components/tableAgents';
import SimpleSSHTerminal from '@/components/terminal/sshTerminal';
import XTermSSH from '@/components/terminal/XTermSSH';

const breadcrumbs = [
    {
        title: 'Terminal',
        href: '/terminal',
    },
];

export default function TableAgents() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="terminal" />
            <XTermSSH/>
        </AppLayout>
    );
}
