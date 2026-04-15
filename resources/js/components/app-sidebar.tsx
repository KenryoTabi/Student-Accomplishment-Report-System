import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, User2Icon, ClipboardListIcon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { accomplishment, dashboard, users } from '@/routes';
import type { NavItem } from '@/types';
import { useRole } from '@/hooks/use-role';
import { ROLES } from '@/constants/roles';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.STUDENT],
    },
    {
        title: 'My Tasks',
        href: accomplishment(),
        icon: ClipboardListIcon,
        roles: [ROLES.EMPLOYEE, ROLES.STUDENT],
    },
    {
        title: 'My Accomplishments',
        href: accomplishment(),
        icon: ClipboardListIcon,
        roles: [ROLES.EMPLOYEE, ROLES.STUDENT],
    },
    {
        title: 'Interns',
        href: "#",
        icon: ClipboardListIcon,
        roles: [ROLES.EMPLOYEE],
    },
    {
        title: 'All Accomplishments',
        href: accomplishment(),
        icon: ClipboardListIcon,
        roles: [ROLES.ADMIN],
    },
    {
        title: 'All Users',
        href: users(),
        icon: User2Icon,
        roles: [ROLES.ADMIN]
    }
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    const { roleId } = useRole();

    const filteredNavItems = mainNavItems.filter(item =>
        !item.roles || item.roles.includes(roleId)
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>

                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
