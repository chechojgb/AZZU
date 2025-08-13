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
    CalendarHeart,
    ListOrderedIcon
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
        icon: LayoutGrid
    },
    {
        title: 'Tabla de agentes',
        href: '/showTableAgents',
        icon: TableProperties,
        proyectosPermitidos: ['AZZU'],
    },
    {
        title: 'estado de operaciones',
        href: '/showOperationState',
        icon: BarChartBig,
        proyectosPermitidos: ['AZZU'],
    },
    {
        title: 'Ranking de agentes',
        href: '/showAgentRankingState',
        icon: HeadphonesIcon,
        proyectosPermitidos: ['AZZU'],
    },
    {
        title: 'Estado de las llamadas',
        href: '/showCallState',
        icon: BookHeadphones,
        proyectosPermitidos: ['AZZU'],
    },
    {
        title: 'Usuarios',
        href: '/users',
        children: [
            { title: 'Administrar', href: '/users' },
            { title: 'Agregar', href: '/users/create' }
        ],
        icon: SquareUserRound,
        proyectosPermitidos: ['AZZU'],
    },
    {
        title: 'Operaciones',
        href: '/Operaciones',
        children: [
            { title: 'Administrar', href: '/areas' },
        ],
        icon: Tags,
        proyectosPermitidos: ['AZZU'],
    },
    {
        title: 'Button Lovers',
        href: '/BLProductos',
        children: [
            { title: 'Productos', href: '/BLproductosInventario/BLProductos' },
            { title: 'Analisis', href: '/BLproductosInventario/BLAnalisis' },
            { title: 'Historico', href: '/BLproductosInventario/BLHistorico' },
        ],
        icon: CalendarHeart,
        
    },
    {
        title: 'Pedidos',
        href: '/BLproductosInventario/BLPedidos',
        icon: ListOrderedIcon,
        proyectosPermitidos: ['Button Lovers', 'AZZU'],
    },
    {
        title: 'clientes',
        href: '/BLproductosInventario/BLClientes',
        icon: SquareUserRound,
        proyectosPermitidos: ['Button Lovers', 'AZZU'],
    }
];

const footerNavItems = [
    {
        title: 'Home',
        href: '/',
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
    console.log('user', user.proyecto);
    
    const [sshSessions, setSshSessions] = useState([]);

    // useEffect(() => {
    //     axios.get('/terminal/index')
    //         .then((res) => setSshSessions(res.data))
    //         .catch((err) => console.error('Error loading SSH sessions', err));
    // }, []);

    const visibleNavItems = staticNavItems.filter(item => {
        // 1. Verificar áreas requeridas
        if (item.requiredAreas?.length && !userHasArea(user, item.requiredAreas)) {
            return false;
        }
        
        // 2. Verificar proyectos (omitir si no hay restricción)
        if (!item.proyectosPermitidos?.length) {
            return true; // Global si no hay filtro
        }
        
        // 3. Si hay proyectos definidos, verificar coincidencia
        return item.proyectosPermitidos.includes(user.proyecto as string);
    });

    // const terminalNavItem = {
    //     title: 'Terminales',
    //     href: '/terminales',
    //     icon: Terminal,
    //     requiredAreas: [1, 2, 3],
    //     children: [
    //         { title: 'Administrar', href: '/terminal-admin' },
    //         ...sshSessions.map(session => ({
    //             title: `${session.host}-${session.username}`,
    //             href: `/terminales/${session.id}`,
    //             key: session.id
    //         }))
    //     ]
    // };

    // visibleNavItems.push(terminalNavItem);

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
