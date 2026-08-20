import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FlaskConical, Leaf, Users } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const FEATURES = [
    { icon: Users, label: 'রোগীর তথ্য ও কেস হিস্ট্রি এক জায়গায়' },
    { icon: BookOpen, label: 'রিপার্টরি ও মেটেরিয়া মেডিকা রেফারেন্স' },
    { icon: FlaskConical, label: 'প্রেসক্রিপশন ও ফলোআপ ব্যবস্থাপনা' },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary/70 p-10 text-primary-foreground lg:flex">
                <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10" />

                <Link
                    href={home()}
                    className="relative z-10 flex items-center gap-2 text-lg font-medium"
                >
                    <Leaf className="size-7" />
                    {name}
                </Link>

                <div className="relative z-10 space-y-6">
                    <p className="text-2xl font-medium text-balance">
                        প্রাকৃতিক চিকিৎসায় আধুনিক ব্যবস্থাপনা
                    </p>
                    <ul className="space-y-3 text-sm text-primary-foreground/90">
                        {FEATURES.map(({ icon: Icon, label }) => (
                            <li key={label} className="flex items-center gap-3">
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

            <div className="flex items-center justify-center bg-background p-6 md:p-10">
                <div className="w-full max-w-sm space-y-8">
                    <Link
                        href={home()}
                        className="flex flex-col items-center gap-2 lg:hidden"
                    >
                        <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                    </Link>

                    <div className="space-y-2 text-center">
                        <h1 className="text-xl font-semibold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
