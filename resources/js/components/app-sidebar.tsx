import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CreditCard,
    FolderGit2,
    LayoutGrid,
    Mail,
    ShieldCheck,
    Users,
} from 'lucide-react';
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
import { dashboard } from '@/routes';
import { index as showAdminPayments } from '@/routes/admin/payments';
import { index as showInvitations } from '@/routes/clinic/invitations';
import { index as showMembers } from '@/routes/clinic/members';
import { show as showSubscription } from '@/routes/subscription';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth, workspace, pendingInvitationsCount } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'সাবস্ক্রিপশন',
            href: showSubscription(),
            icon: CreditCard,
        },
    ];

    if (pendingInvitationsCount > 0) {
        mainNavItems.push({
            title: `ক্লিনিক আমন্ত্রণ (${pendingInvitationsCount})`,
            href: showInvitations(),
            icon: Mail,
        });
    }

    if (workspace?.type === 'clinic') {
        mainNavItems.push({
            title: 'ক্লিনিক সদস্য',
            href: showMembers(),
            icon: Users,
        });
    }

    if (auth.user.is_admin) {
        mainNavItems.push({
            title: 'পেমেন্ট পরিচালনা',
            href: showAdminPayments(),
            icon: ShieldCheck,
        });
    }

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
