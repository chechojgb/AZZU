import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface AreaRole {
    area_id: number;
    area: {
        nombre: string;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    areaRoles: AreaRole[];
    [key: string]: unknown;
}

export interface InertiaProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
    requiredAreas?: number[];
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: { user: User };
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
