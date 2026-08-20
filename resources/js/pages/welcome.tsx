import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarClock,
    FlaskConical,
    Leaf,
    ShieldCheck,
    Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, home, login, register } from '@/routes';

const BRAND_FEATURES = [
    { icon: Users, label: 'রোগীর তথ্য ও কেস হিস্ট্রি এক জায়গায়' },
    { icon: BookOpen, label: 'রিপার্টরি ও মেটেরিয়া মেডিকা রেফারেন্স' },
    { icon: FlaskConical, label: 'প্রেসক্রিপশন ও ফলোআপ ব্যবস্থাপনা' },
];

const CONTENT_FEATURES: {
    icon: ComponentType<{ className?: string }>;
    label: string;
}[] = [
    { icon: Users, label: 'রোগী ব্যবস্থাপনা' },
    { icon: FlaskConical, label: 'কেস ও প্রেসক্রিপশন' },
    { icon: CalendarClock, label: 'ফলোআপ রিমাইন্ডার' },
    { icon: BookOpen, label: 'বিশ্লেষণ টুলস' },
    { icon: ShieldCheck, label: 'ক্লিনিক টিম' },
    { icon: Leaf, label: 'প্রাকৃতিক চিকিৎসা' },
];

export default function Welcome() {
    const { auth, name } = usePage().props;

    return (
        <>
            <Head title="স্বাগতম" />

            <div className="relative grid min-h-svh lg:grid-cols-2">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary/70 p-10 text-primary-foreground lg:flex">
                    <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10" />

                    <div className="relative z-10 flex items-center gap-2 text-lg font-medium">
                        <Leaf className="size-7" />
                        {name}
                    </div>

                    <div className="relative z-10 space-y-6">
                        <p className="text-2xl font-medium text-balance">
                            প্রাকৃতিক চিকিৎসায় আধুনিক ব্যবস্থাপনা
                        </p>
                        <ul className="space-y-3 text-sm text-primary-foreground/90">
                            {BRAND_FEATURES.map(({ icon: Icon, label }) => (
                                <li
                                    key={label}
                                    className="flex items-center gap-3"
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                                        <Icon className="size-4" />
                                    </span>
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="relative z-10 text-xs text-primary-foreground/70">
                        হোমিওপ্যাথিক প্র্যাকটিশনারদের জন্য তৈরি
                    </p>
                </div>

                <div className="flex flex-col bg-background">
                    <div className="flex items-center justify-between p-6">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 font-medium lg:hidden"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                                <AppLogoIcon className="size-4.5" />
                            </div>
                            {name}
                        </Link>

                        <nav className="ml-auto flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>
                                        ড্যাশবোর্ডে যান
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        লগইন
                                    </Link>
                                    <Button asChild size="sm">
                                        <Link href={register()}>
                                            নিবন্ধন করুন
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                        <div className="w-full max-w-sm space-y-8">
                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-semibold text-balance">
                                    আপনার হোমিওপ্যাথি প্র্যাকটিসের ডিজিটাল
                                    সহায়ক
                                </h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    রোগীর তথ্য, কেস হিস্ট্রি, প্রেসক্রিপশন ও
                                    ফলোআপ — সবকিছু এক জায়গায় সহজে পরিচালনা
                                    করুন।
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                {auth.user ? (
                                    <Button asChild className="w-full">
                                        <Link href={dashboard()}>
                                            ড্যাশবোর্ডে যান
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild className="w-full">
                                            <Link href={register()}>
                                                শুরু করুন
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Link href={login()}>লগইন</Link>
                                        </Button>
                                    </>
                                )}
                            </div>

                            <ul className="grid grid-cols-2 gap-3 text-sm">
                                {CONTENT_FEATURES.map(
                                    ({ icon: Icon, label }) => (
                                        <li
                                            key={label}
                                            className="flex items-center gap-2 rounded-lg border p-3"
                                        >
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Icon className="size-3.5" />
                                            </span>
                                            <span className="text-muted-foreground">
                                                {label}
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>

                            <p className="text-center text-xs text-muted-foreground">
                                শিক্ষা ও গবেষণার জন্য — {name} &copy;{' '}
                                {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
