import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    TableProperties,
    SquareUserRound,
    Tags,
    BarChartBig,
    BookHeadphones,
    HeadphonesIcon,
    Terminal,
    CalendarHeart
} from 'lucide-react';
import AppLogo from './app-logo';
import { userHasArea } from '@/components/utils/useAuthUtils';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { InertiaProps } from '@/types';

const staticNavItems = [
    {
        title: 'AzzuBoard',
        href: '/dashboard',
        icon: LayoutGrid,
        requiredAreas: [1,2, 3],
    },
    {
        title: 'Tabla de agentes',
        href: '/showTableAgents',
        icon: TableProperties,
        requiredAreas: [1,2, 3],
    },
    {
        title: 'estado de operaciones',
        href: '/showOperationState',
        icon: BarChartBig,
        requiredAreas: [1,2, 3],
    },
    {
        title: 'Ranking de agentes',
        href: '/showAgentRankingState',
        icon: HeadphonesIcon,
        requiredAreas: [1,2, 3],
    },
    {
        title: 'Estado de las llamadas',
        href: '/showCallState',
        icon: BookHeadphones,
        requiredAreas: [1,2, 3],
    },
    {
        title: 'Usuarios',
        href: '/users',
        children: [
            { title: 'Administrar', href: '/users' },
            { title: 'Agregar', href: '/users/create' }
        ],
        icon: SquareUserRound,
        requiredAreas: [1,2, 3],
    },
    {
        title: 'Operaciones',
        href: '/Operaciones',
        children: [
            { title: 'Administrar', href: '/areas' },
        ],
        icon: Tags,
        requiredAreas: [1,2, 3],
    },
    {
        title: 'Button Lovers',
        href: '/BLProductos',
        children: [
            { title: 'Productos', href: '/BLproductosInventario/BLProductos' },
            { title: 'Analisis', href: '/' },
            { title: 'Historico', href: '/' },
        ],
        icon: CalendarHeart,
        requiredAreas: [1,2, 3],
    }
];

const footerNavItems = [
    {
        title: 'Home',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<InertiaProps>().props;
    const user = auth?.user ?? { areaRoles: [] };
    const [sshSessions, setSshSessions] = useState([]);

    useEffect(() => {
        axios.get('/terminal/index')
            .then((res) => setSshSessions(res.data))
            .catch((err) => console.error('Error loading SSH sessions', err));
    }, []);

    const visibleNavItems = staticNavItems.filter(item => {
        const required = item.requiredAreas ?? [];
        return userHasArea(user, required);
    });

    const terminalNavItem = {
        title: 'Terminales',
        href: '/terminales',
        icon: Terminal,
        requiredAreas: [1, 2, 3],
        children: [
            { title: 'Administrar', href: '/terminal-admin' },
            ...sshSessions.map(session => ({
                title: `${session.host}-${session.username}`,
                href: `/terminales/${session.id}`,
                key: session.id
            }))
        ]
    };

    visibleNavItems.push(terminalNavItem);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
