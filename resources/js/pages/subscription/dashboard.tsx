import { Head, Link } from '@inertiajs/react';
import {
    create as createPayment,
    history,
} from '@/actions/App/Http/Controllers/Subscription/PaymentController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    workspace: { id: number; name: string; type: 'personal' | 'clinic' };
    subscription: {
        plan: 'trial' | 'practitioner' | 'clinic';
        plan_label: string;
        status: string;
        starts_at: string | null;
        ends_at: string | null;
        trial_ends_at: string | null;
    };
    isOnTrial: boolean;
    trialExpired: boolean;
    hasActiveSubscription: boolean;
    remainingDays: number;
    isOwner: boolean;
};

function formatDate(value: string | null) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const statusLabels: Record<string, string> = {
    trial: 'ফ্রি ট্রায়াল',
    pending: 'পর্যালোচনাধীন',
    active: 'সক্রিয়',
    expired: 'মেয়াদ উত্তীর্ণ',
    cancelled: 'বাতিলকৃত',
};

export default function SubscriptionDashboard({
    workspace,
    subscription,
    isOnTrial,
    trialExpired,
    hasActiveSubscription,
    remainingDays,
    isOwner,
}: Props) {
    const needsToSubscribe =
        trialExpired || (!isOnTrial && !hasActiveSubscription);

    return (
        <>
            <Head title="সাবস্ক্রিপশন" />

            <div className="max-w-2xl space-y-6">
                <Heading
                    title="সাবস্ক্রিপশন"
                    description={`${workspace.name}-এর জন্য বর্তমান পরিকল্পনা ও অবস্থা`}
                />

                {needsToSubscribe && (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium">
                                    {trialExpired
                                        ? 'আপনার ফ্রি ট্রায়ালের মেয়াদ শেষ হয়ে গেছে।'
                                        : 'সাবস্ক্রিপশন সক্রিয় নেই।'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    বিদ্যমান তথ্য শুধু দেখা যাবে। নতুন কিছু যোগ
                                    করতে সাবস্ক্রাইব করুন।
                                </p>
                            </div>
                            {isOwner && (
                                <Button asChild>
                                    <Link href="/pricing">
                                        সাবস্ক্রাইব করুন
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{subscription.plan_label}</CardTitle>
                            <Badge
                                variant={
                                    hasActiveSubscription || isOnTrial
                                        ? 'default'
                                        : 'destructive'
                                }
                            >
                                {statusLabels[subscription.status] ??
                                    subscription.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    শুরুর তারিখ
                                </p>
                                <p className="font-medium">
                                    {formatDate(subscription.starts_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    {isOnTrial
                                        ? 'ট্রায়াল শেষ হবে'
                                        : 'মেয়াদ শেষ হবে'}
                                </p>
                                <p className="font-medium">
                                    {formatDate(
                                        isOnTrial
                                            ? subscription.trial_ends_at
                                            : subscription.ends_at,
                                    )}
                                </p>
                            </div>
                        </div>

                        {(isOnTrial || hasActiveSubscription) && (
                            <p className="text-sm text-muted-foreground">
                                বাকি আছে{' '}
                                <span className="font-medium text-foreground">
                                    {remainingDays} দিন
                                </span>
                            </p>
                        )}

                        {isOwner && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {subscription.plan !== 'trial' && (
                                    <Button asChild>
                                        <Link
                                            href={createPayment(
                                                subscription.plan,
                                            )}
                                        >
                                            সাবস্ক্রিপশন নবায়ন করুন
                                        </Link>
                                    </Button>
                                )}
                                {subscription.plan !== 'clinic' && (
                                    <Button variant="outline" asChild>
                                        <Link href={createPayment('clinic')}>
                                            ক্লিনিকে আপগ্রেড করুন
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div>
                    <Link
                        href={history()}
                        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                        পেমেন্ট ইতিহাস দেখুন
                    </Link>
                </div>
            </div>
        </>
    );
}

SubscriptionDashboard.layout = {
    breadcrumbs: [{ title: 'সাবস্ক্রিপশন', href: '/subscription' }],
};
