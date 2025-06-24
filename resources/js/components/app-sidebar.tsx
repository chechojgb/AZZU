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
    HeadphonesIcon
} from 'lucide-react';
import AppLogo from './app-logo';
import { userHasArea } from '@/components/utils/useAuthUtils';
import type { InertiaProps } from '@/types';

const mainNavItems = [
    {
        title: 'AzzuBoard',
        href: '/dashboard',
        icon: LayoutGrid,
        requiredAreas: [2, 3], // Soporte y Supervisor
    },
    {
        title: 'Tabla de agentes',
        href: '/showTableAgents',
        icon: TableProperties,
        requiredAreas: [2, 3],
    },
    {
        title: 'estado de operaciones',
        href: '/showOperationState',
        icon: BarChartBig,
        requiredAreas: [2, 3],
    },
    {
        title: 'Ranking de agentes',
        href: '/showAgentRankingState',
        icon: HeadphonesIcon,
        requiredAreas: [2, 3],
    },
    {
        title: 'Estado de las llamadas',
        href: '/showCallState',
        icon: BookHeadphones,
        requiredAreas: [2, 3],
    },
    {
        title: 'Usuarios',
        href: '/users',
        children: [
            { title: 'Administrar', href: '/users' },
            { title: 'Agregar', href: '/users/create' }
        ],
        icon: SquareUserRound,

    },
    {
        title: 'Operaciones',
        href: '/Operaciones',
        children: [
            { title: 'Administrar', href: '/areas' },
        ],
        icon: Tags,

    },
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
    
    // console.log("user", user);
    
    
    const visibleNavItems = mainNavItems.filter(item => {
        const required = item.requiredAreas ?? [];
        return userHasArea(user, required);
    });
    // console.log("visibleNavItems", visibleNavItems);

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
