import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, TableProperties, SquareUserRound, Tags } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'MysoulBoard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Tabla de agentes',
        href: '/showTableAgents',
        icon: TableProperties,
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
        title: 'Areas',
        href: '/Areas',
        children: [
        { title: 'Administrar', href: '/areas' },
        { title: 'Agregar', href: '/users/create' }
        ],
        icon: Tags,
    },
];

const footerNavItems: NavItem[] = [
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
    return (
        <>
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
        </>
    );
}
