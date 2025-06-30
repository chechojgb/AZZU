import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import DarkModeDash from './dark-modeDash';
import SidebarDropdown from './SidebarDropdown';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
                <DarkModeDash/>
                {items.map((item) =>
                    item.children ? (
                        <SidebarDropdown key={item.title} item={item} currentPath={page.url} />
                    ) : (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.href === page.url}>
                            <Link href={item.href}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}