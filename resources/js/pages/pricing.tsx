import { Head, Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { create as createPayment } from '@/actions/App/Http/Controllers/Subscription/PaymentController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Plan = {
    value: 'trial' | 'practitioner' | 'clinic';
    label: string;
    price: number;
    included_seats: number;
    extra_seat_price: number;
};

export default function Pricing({ plans }: { plans: Plan[] }) {
    return (
        <>
            <Head title="মূল্য পরিকল্পনা" />

            <div className="space-y-8">
                <Heading
                    title="আপনার জন্য সঠিক পরিকল্পনা বেছে নিন"
                    description="৭ দিনের ফ্রি ট্রায়াল দিয়ে শুরু করুন, তারপর প্রয়োজন অনুযায়ী সাবস্ক্রাইব করুন।"
                />

                <div className="grid gap-6 md:grid-cols-3">
                    {plans.map((plan) => {
                        const isClinic = plan.value === 'clinic';
                        const isTrial = plan.value === 'trial';

                        return (
                            <Card
                                key={plan.value}
                                className={
                                    isClinic
                                        ? 'border-primary shadow-md ring-1 ring-primary'
                                        : ''
                                }
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">
                                            {plan.label}
                                        </CardTitle>
                                        {isClinic && (
                                            <Badge>সবচেয়ে জনপ্রিয়</Badge>
                                        )}
                                    </div>
                                    <CardDescription>
                                        {isTrial
                                            ? '৭ দিনের জন্য সম্পূর্ণ বিনামূল্যে'
                                            : `${plan.included_seats} জন ব্যবহারকারী অন্তর্ভুক্ত`}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-3xl font-semibold">
                                        {isTrial ? (
                                            'ফ্রি'
                                        ) : (
                                            <>
                                                ৳{plan.price}
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    {' '}
                                                    / মাস
                                                </span>
                                            </>
                                        )}
                                    </p>

                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <Check className="size-4 text-primary" />
                                            কেস টেকিং ও রেপার্টরি
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="size-4 text-primary" />
                                            ম্যাটেরিয়া মেডিকা
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="size-4 text-primary" />
                                            ফলো-আপ ও নোটস
                                        </li>
                                        {isClinic && (
                                            <li className="flex items-center gap-2">
                                                <Check className="size-4 text-primary" />
                                                অতিরিক্ত সদস্য প্রতি মাসে ৳
                                                {plan.extra_seat_price}
                                            </li>
                                        )}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    {isTrial ? (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            disabled
                                        >
                                            নিবন্ধনের পর স্বয়ংক্রিয়ভাবে শুরু
                                        </Button>
                                    ) : (
                                        <Button asChild className="w-full">
                                            <Link
                                                href={createPayment(plan.value)}
                                            >
                                                {plan.label} সাবস্ক্রাইব করুন
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Pricing.layout = {
    breadcrumbs: [{ title: 'মূল্য পরিকল্পনা', href: '/pricing' }],
};
