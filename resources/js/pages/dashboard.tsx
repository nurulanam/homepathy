import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bone,
    BookOpen,
    Brain,
    CalendarClock,
    CreditCard,
    FilePlus2,
    FileText,
    Flame,
    Mail,
    Pill,
    ScrollText,
    Sparkles,
    UserPlus,
    Users,
    UsersRound,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { index as showInvitations } from '@/routes/clinic/invitations';
import { index as showMembers } from '@/routes/clinic/members';
import { show as showSubscription } from '@/routes/subscription';

const STAT_CARDS: {
    label: string;
    value: string;
    icon: ComponentType<{ className?: string }>;
    tone: 'primary' | 'blue' | 'amber' | 'rose';
}[] = [
    { label: 'মোট রোগী', value: '128', icon: Users, tone: 'primary' },
    { label: 'সক্রিয় কেস', value: '34', icon: FileText, tone: 'blue' },
    {
        label: 'আজকের ফলোআপ',
        value: '5',
        icon: CalendarClock,
        tone: 'amber',
    },
    {
        label: 'বিলম্বিত ফলোআপ',
        value: '2',
        icon: AlertTriangle,
        tone: 'rose',
    },
];

const STAT_TONE_CLASSES: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

type FollowUpStatus = 'today' | 'overdue' | 'upcoming' | 'done';

const FOLLOW_UP_PILLS: Record<
    FollowUpStatus,
    { label: string; className: string }
> = {
    today: { label: 'আজ', className: 'bg-primary/10 text-primary' },
    overdue: {
        label: 'বিলম্বিত',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
    upcoming: {
        label: 'আসন্ন',
        className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    done: { label: 'সম্পন্ন', className: 'bg-muted text-muted-foreground' },
};

const RECENT_CASES: {
    patient: string;
    remedy: string;
    date: string;
    diagnosis: string;
    status: FollowUpStatus;
}[] = [
    {
        patient: 'রহিম উদ্দিন',
        remedy: 'Sulphur 200',
        date: 'Aug 18, 2026',
        diagnosis: 'দীর্ঘস্থায়ী চর্মরোগ',
        status: 'today',
    },
    {
        patient: 'ফাতেমা বেগম',
        remedy: 'Nux Vomica 30',
        date: 'Aug 15, 2026',
        diagnosis: 'অম্লতা, খিটখিটে মেজাজ',
        status: 'overdue',
    },
    {
        patient: 'কামাল হোসেন',
        remedy: 'Pulsatilla 200',
        date: 'Aug 20, 2026',
        diagnosis: 'বারবার ঠান্ডা লাগা',
        status: 'upcoming',
    },
    {
        patient: 'নাসরিন আক্তার',
        remedy: 'Arsenicum Album 30',
        date: 'Aug 10, 2026',
        diagnosis: 'উদ্বেগ, অস্থিরতা',
        status: 'done',
    },
    {
        patient: 'সালমা খাতুন',
        remedy: 'Calcarea Carbonica 200',
        date: 'Aug 9, 2026',
        diagnosis: 'বিকাশে বিলম্ব',
        status: 'done',
    },
    {
        patient: 'ইব্রাহিম মিয়া',
        remedy: 'Lycopodium 1M',
        date: 'Aug 6, 2026',
        diagnosis: 'পরিপাকজনিত দুর্বলতা',
        status: 'done',
    },
];

const TODAY_FOLLOW_UPS = RECENT_CASES.filter(
    (c) => c.status === 'today' || c.status === 'overdue',
);

const QUICK_ACTIONS: {
    label: string;
    icon: ComponentType<{ className?: string }>;
}[] = [
    { label: 'নতুন রোগী', icon: UserPlus },
    { label: 'নতুন কেস', icon: FilePlus2 },
    { label: 'রিপার্টরি', icon: BookOpen },
    { label: 'মেটেরিয়া মেডিকা', icon: Pill },
];

const ANALYSIS_TOOLS: {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    tint: string;
}[] = [
    {
        label: 'রিপার্টরি',
        description: 'রুব্রিক ভিত্তিক রেমেডি অনুসন্ধান',
        icon: BookOpen,
        tint: 'bg-cyan-500/15 text-cyan-500',
    },
    {
        label: 'মেটেরিয়া মেডিকা',
        description: 'রেমেডি রেফারেন্স লাইব্রেরি',
        icon: Pill,
        tint: 'bg-violet-500/15 text-violet-400',
    },
    {
        label: 'মায়াজম বিশ্লেষণ',
        description: 'সোরা, সাইকোসিস, সিফিলিস',
        icon: Brain,
        tint: 'bg-indigo-500/15 text-indigo-400',
    },
    {
        label: 'টেম্পারামেন্ট',
        description: 'সাংবিধানিক ধরণ নির্ণয়',
        icon: Sparkles,
        tint: 'bg-amber-500/15 text-amber-500',
    },
    {
        label: 'একিউট কেস',
        description: 'আকস্মিক রোগের চিকিৎসা',
        icon: Flame,
        tint: 'bg-rose-500/15 text-rose-500',
    },
    {
        label: 'অর্গানন',
        description: 'অ্যাফোরিজম রেফারেন্স',
        icon: ScrollText,
        tint: 'bg-emerald-500/15 text-emerald-500',
    },
    {
        label: 'অ্যানাটমি',
        description: 'রুব্রিক সংযুক্ত অ্যানাটমি',
        icon: Bone,
        tint: 'bg-slate-500/15 text-slate-400',
    },
];

function getGreeting(hour: number): string {
    if (hour < 12) {
        return 'শুভ সকাল';
    }

    if (hour < 17) {
        return 'শুভ অপরাহ্ণ';
    }

    if (hour < 20) {
        return 'শুভ সন্ধ্যা';
    }

    return 'শুভ রাত্রি';
}

export default function Dashboard() {
    const { auth, workspace, pendingInvitationsCount } = usePage().props;
    const today = new Date();
    const firstName = auth.user.name.split(' ')[0];

    return (
        <>
            <Head title="ড্যাশবোর্ড" />
            <div className="flex flex-1 flex-col gap-6">
                <div className="relative overflow-hidden rounded-xl border bg-linear-to-br from-primary/15 via-primary/5 to-transparent p-6">
                    <p className="text-sm text-muted-foreground">
                        {today.toLocaleDateString('bn-BD', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold">
                        {getGreeting(today.getHours())}, {firstName}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {workspace?.type === 'clinic'
                            ? 'আজ আপনার ক্লিনিকে যা ঘটছে।'
                            : 'আজ আপনার প্র্যাকটিসে যা ঘটছে।'}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STAT_CARDS.map(({ label, value, icon: Icon, tone }) => (
                        <Card key={label}>
                            <CardContent className="flex items-center gap-4">
                                <div
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${STAT_TONE_CLASSES[tone]}`}
                                >
                                    <Icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">
                                        {value}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {label}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>সাম্প্রতিক কেস</CardTitle>
                            <Badge variant="secondary">
                                {RECENT_CASES.length}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="py-2 pr-4 font-medium">
                                                রোগী
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                রেমেডি
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                রোগ নির্ণয়
                                            </th>
                                            <th className="py-2 pr-4 font-medium">
                                                তারিখ
                                            </th>
                                            <th className="py-2 font-medium">
                                                অবস্থা
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {RECENT_CASES.map((c) => (
                                            <tr
                                                key={c.patient}
                                                className="border-b last:border-0"
                                            >
                                                <td className="py-2 pr-4 font-medium">
                                                    {c.patient}
                                                </td>
                                                <td className="py-2 pr-4 text-muted-foreground">
                                                    {c.remedy}
                                                </td>
                                                <td className="py-2 pr-4 text-muted-foreground">
                                                    {c.diagnosis}
                                                </td>
                                                <td className="py-2 pr-4 text-muted-foreground">
                                                    {c.date}
                                                </td>
                                                <td className="py-2">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${FOLLOW_UP_PILLS[c.status].className}`}
                                                    >
                                                        {
                                                            FOLLOW_UP_PILLS[
                                                                c.status
                                                            ].label
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-3 text-xs text-muted-foreground">
                                নমুনা তথ্য দেখানো হচ্ছে — কেস ট্র্যাকিং চালু
                                হলে রোগীর তথ্য এখানে দেখা যাবে।
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>আজকের ফলোআপ</CardTitle>
                            <Badge variant="secondary">
                                {TODAY_FOLLOW_UPS.length}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {TODAY_FOLLOW_UPS.map((c) => (
                                <div
                                    key={c.patient}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {c.patient}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {c.remedy}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${FOLLOW_UP_PILLS[c.status].className}`}
                                    >
                                        {FOLLOW_UP_PILLS[c.status].label}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>দ্রুত কাজ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
                                <button
                                    key={label}
                                    type="button"
                                    disabled
                                    className="flex items-center gap-3 rounded-lg border p-3 text-left opacity-60"
                                >
                                    <Icon className="size-5 text-muted-foreground" />
                                    <span className="flex-1 text-sm font-medium">
                                        {label}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px]"
                                    >
                                        শীঘ্রই
                                    </Badge>
                                </button>
                            ))}

                            <Link
                                href={showSubscription()}
                                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                            >
                                <CreditCard className="size-5 text-primary" />
                                <span className="text-sm font-medium">
                                    সাবস্ক্রিপশন
                                </span>
                            </Link>

                            {workspace?.type === 'clinic' && (
                                <Link
                                    href={showMembers()}
                                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                                >
                                    <UsersRound className="size-5 text-primary" />
                                    <span className="text-sm font-medium">
                                        ক্লিনিক সদস্য
                                    </span>
                                </Link>
                            )}

                            {pendingInvitationsCount > 0 && (
                                <Link
                                    href={showInvitations()}
                                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                                >
                                    <Mail className="size-5 text-primary" />
                                    <span className="text-sm font-medium">
                                        ক্লিনিক আমন্ত্রণ (
                                        {pendingInvitationsCount})
                                    </span>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>বিশ্লেষণ টুলস</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {ANALYSIS_TOOLS.map(
                                ({ label, description, icon: Icon, tint }) => (
                                    <div
                                        key={label}
                                        className="flex items-start gap-3 rounded-lg border p-3 opacity-75"
                                    >
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tint}`}
                                        >
                                            <Icon className="size-4.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {label}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                            শীঘ্রই আসছে — আপনার প্র্যাকটিসের জন্য
                            হোমিওপ্যাথিক বিশ্লেষণ টুলস।
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'ড্যাশবোর্ড',
            href: dashboard(),
        },
    ],
};
