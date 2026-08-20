import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { store } from '@/actions/App/Http/Controllers/Subscription/PaymentController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type PaymentMethod = {
    value: 'bkash' | 'nagad';
    label: string;
    number: string | null;
};

type Props = {
    plan: { value: string; label: string };
    amount: number;
    paymentMethods: PaymentMethod[];
};

export default function Payment({ plan, amount, paymentMethods }: Props) {
    const [method, setMethod] = useState<PaymentMethod>(paymentMethods[0]);

    return (
        <>
            <Head title="পেমেন্ট" />

            <div className="max-w-lg space-y-6">
                <Heading
                    title="পেমেন্ট সম্পন্ন করুন"
                    description="bKash বা Nagad দিয়ে টাকা পাঠিয়ে লেনদেন আইডি জমা দিন।"
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-baseline justify-between">
                            <span>{plan.label}</span>
                            <span className="text-2xl font-semibold">
                                ৳{amount}
                                <span className="text-sm font-normal text-muted-foreground">
                                    {' '}
                                    / মাস
                                </span>
                            </span>
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Form
                    {...store.form()}
                    className="space-y-6"
                    options={{ preserveScroll: true }}
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="plan"
                                value={plan.value}
                            />

                            <div className="space-y-2">
                                <Label>পেমেন্ট মাধ্যম</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {paymentMethods.map((pm) => (
                                        <label
                                            key={pm.value}
                                            className={cn(
                                                'flex cursor-pointer items-center justify-center rounded-md border py-3 text-sm font-medium transition-colors',
                                                method.value === pm.value
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-input hover:bg-accent',
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={pm.value}
                                                checked={
                                                    method.value === pm.value
                                                }
                                                onChange={() => setMethod(pm)}
                                                className="sr-only"
                                            />
                                            {pm.label}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.payment_method} />
                            </div>

                            {method.number && (
                                <p className="rounded-md bg-muted px-3 py-2 text-sm">
                                    এই {method.label} নম্বরে ৳{amount} পাঠান:{' '}
                                    <span className="font-semibold">
                                        {method.number}
                                    </span>
                                </p>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="transaction_id">
                                    লেনদেন আইডি
                                </Label>
                                <Input
                                    id="transaction_id"
                                    name="transaction_id"
                                    required
                                    placeholder="যেমন: 8N7A6B5C4D"
                                />
                                <InputError message={errors.transaction_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sender_mobile">
                                    প্রেরকের মোবাইল নম্বর
                                </Label>
                                <Input
                                    id="sender_mobile"
                                    name="sender_mobile"
                                    required
                                    placeholder="01XXXXXXXXX"
                                />
                                <InputError message={errors.sender_mobile} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                পেমেন্ট জমা দিন
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Payment.layout = {
    breadcrumbs: [
        { title: 'সাবস্ক্রিপশন', href: '/subscription' },
        { title: 'পেমেন্ট', href: '#' },
    ],
};
