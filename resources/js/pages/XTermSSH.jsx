
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AgentPanel from '@/components/tableAgents';
import SimpleSSHTerminal from '@/components/terminal/sshTerminal';
import XTermSSH from '@/components/terminal/XTermSSH';
import { usePage } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Terminal',
        href: '/terminal',
    },
];

export default function TableAgents() {
    const { props } = usePage();
    const sessionId = props.sessionId;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="terminal" />
            <div className='p-8 space-y-8 w-full h-[calc(100vh-4rem)]'>
                <XTermSSH sessionId={sessionId}/>
            </div>
        </AppLayout>
    );
}
