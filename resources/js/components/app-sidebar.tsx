import { Link, usePage } from '@inertiajs/react';
import {
    Bone,
    BookOpen,
    Brain,
    CreditCard,
    FileText,
    Flame,
    FolderGit2,
    LayoutGrid,
    Mail,
    Pill,
    ScrollText,
    ShieldCheck,
    Sparkles,
    Users,
    UsersRound,
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
import { index as showCases } from '@/routes/cases';
import { index as showInvitations } from '@/routes/clinic/invitations';
import { index as showMembers } from '@/routes/clinic/members';
import { index as showPatients } from '@/routes/patients';
import { show as showSubscription } from '@/routes/subscription';
import {
    acuteCases,
    anatomy,
    materiaMedica,
    miasm,
    organon,
    repertory,
    temperament,
} from '@/routes/tools';
import type { NavItem } from '@/types';

const analysisToolItems: NavItem[] = [
    { title: 'Repertory', href: repertory(), icon: BookOpen },
    { title: 'Materia medica', href: materiaMedica(), icon: Pill },
    { title: 'Miasm analysis', href: miasm(), icon: Brain },
    { title: 'Temperament', href: temperament(), icon: Sparkles },
    { title: 'Acute cases', href: acuteCases(), icon: Flame },
    { title: 'Organon', href: organon(), icon: ScrollText },
    { title: 'Anatomy', href: anatomy(), icon: Bone },
];

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
            title: 'Patients',
            href: showPatients(),
            icon: Users,
        },
        {
            title: 'Cases',
            href: showCases(),
            icon: FileText,
        },
        {
            title: 'Analysis tools',
            icon: BookOpen,
            items: analysisToolItems,
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
            icon: UsersRound,
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
