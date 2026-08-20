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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

const FEATURES: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
}[] = [
    {
        icon: Users,
        title: 'রোগী ব্যবস্থাপনা',
        description: 'রোগীর তথ্য, যোগাযোগ ও ইতিহাস এক জায়গায় সংরক্ষণ করুন।',
    },
    {
        icon: FlaskConical,
        title: 'কেস ও প্রেসক্রিপশন',
        description: 'প্রতিটি কেস রেকর্ড করুন এবং রেমেডি ট্র্যাক করুন।',
    },
    {
        icon: CalendarClock,
        title: 'ফলোআপ রিমাইন্ডার',
        description: 'আজকের ও বিলম্বিত ফলোআপ এক নজরে দেখুন।',
    },
    {
        icon: BookOpen,
        title: 'বিশ্লেষণ টুলস',
        description: 'রিপার্টরি, মেটেরিয়া মেডিকা ও মায়াজম বিশ্লেষণ।',
    },
    {
        icon: ShieldCheck,
        title: 'ক্লিনিক টিম',
        description: 'সহকারী ও রিসেপশনিস্টদের নিয়ে ক্লিনিক পরিচালনা করুন।',
    },
    {
        icon: Leaf,
        title: 'প্রাকৃতিক চিকিৎসা',
        description: 'হোমিওপ্যাথিক প্র্যাকটিসের জন্য বিশেষভাবে তৈরি।',
    },
];

export default function Welcome() {
    const { auth, name } = usePage().props;

    return (
        <>
            <Head title="স্বাগতম" />
            <div className="flex min-h-svh flex-col bg-background text-foreground">
                <header className="border-b">
                    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                        <div className="flex items-center gap-2 font-medium">
                            <Leaf className="size-5 text-primary" />
                            {name}
                        </div>

                        <nav className="flex items-center gap-3 text-sm">
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
                </header>

                <main className="flex-1">
                    <section className="mx-auto max-w-5xl px-6 py-20 text-center">
                        <p className="text-sm font-medium text-primary">
                            হোমিওপ্যাথিক প্র্যাকটিশনারদের জন্য তৈরি
                        </p>
                        <h1 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl">
                            প্রাকৃতিক চিকিৎসায় আধুনিক ব্যবস্থাপনা
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            রোগীর তথ্য, কেস হিস্ট্রি, প্রেসক্রিপশন ও ফলোআপ —
                            সবকিছু এক জায়গায় সহজে পরিচালনা করুন।
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-3">
                            {auth.user ? (
                                <Button asChild size="lg">
                                    <Link href={dashboard()}>
                                        ড্যাশবোর্ডে যান
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg">
                                        <Link href={register()}>শুরু করুন</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href={login()}>লগইন</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="mx-auto max-w-5xl px-6 pb-20">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map(
                                ({ icon: Icon, title, description }) => (
                                    <Card key={title}>
                                        <CardContent className="space-y-2">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="size-4.5" />
                                            </div>
                                            <h2 className="font-medium">
                                                {title}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ),
                            )}
                        </div>
                    </section>
                </main>

                <footer className="border-t py-6 text-center text-xs text-muted-foreground">
                    শিক্ষা ও গবেষণার জন্য — {name} &copy;{' '}
                    {new Date().getFullYear()}
                </footer>
            </div>
        </>
    );
}
