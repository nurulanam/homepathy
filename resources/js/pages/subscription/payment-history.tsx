import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';

type Payment = {
    id: number;
    plan: string;
    amount: number;
    payment_method: string;
    transaction_id: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string | null;
    reviewed_at: string | null;
    rejection_reason: string | null;
};

const planLabels: Record<string, string> = {
    trial: 'ফ্রি ট্রায়াল',
    practitioner: 'Practitioner',
    clinic: 'Clinic',
};

const methodLabels: Record<string, string> = {
    bkash: 'bKash',
    nagad: 'Nagad',
};

const statusVariant: Record<string, 'default' | 'destructive' | 'outline'> = {
    pending: 'outline',
    approved: 'default',
    rejected: 'destructive',
};

const statusLabels: Record<string, string> = {
    pending: 'পেমেন্ট যাচাই হচ্ছে',
    approved: 'অনুমোদিত',
    rejected: 'প্রত্যাখ্যাত',
};

function formatDate(value: string | null) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function PaymentHistory({ payments }: { payments: Payment[] }) {
    return (
        <>
            <Head title="পেমেন্ট ইতিহাস" />

            <div className="space-y-6">
                <Heading
                    title="পেমেন্ট ইতিহাস"
                    description="আপনার সকল পেমেন্ট জমা ও তাদের অবস্থা।"
                />

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">তারিখ</th>
                                <th className="px-4 py-3 font-medium">
                                    পরিকল্পনা
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    পরিমাণ
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    মাধ্যম
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    লেনদেন আইডি
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    অবস্থা
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {payments.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        এখনও কোনো পেমেন্ট জমা দেওয়া হয়নি।
                                    </td>
                                </tr>
                            )}
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-3">
                                        {formatDate(payment.submitted_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {planLabels[payment.plan] ??
                                            payment.plan}
                                    </td>
                                    <td className="px-4 py-3">
                                        ৳{payment.amount}
                                    </td>
                                    <td className="px-4 py-3">
                                        {methodLabels[payment.payment_method] ??
                                            payment.payment_method}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">
                                        {payment.transaction_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                statusVariant[payment.status]
                                            }
                                        >
                                            {statusLabels[payment.status]}
                                        </Badge>
                                        {payment.status === 'rejected' &&
                                            payment.rejection_reason && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {payment.rejection_reason}
                                                </p>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

PaymentHistory.layout = {
    breadcrumbs: [
        { title: 'সাবস্ক্রিপশন', href: '/subscription' },
        { title: 'পেমেন্ট ইতিহাস', href: '/subscription/payments' },
    ],
};
