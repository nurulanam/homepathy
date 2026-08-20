import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    approve,
    index,
    reject,
} from '@/actions/App/Http/Controllers/Admin/PaymentController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Payment = {
    id: number;
    user: { name: string; email: string };
    workspace: string;
    plan: string;
    amount: number;
    payment_method: string;
    transaction_id: string;
    sender_mobile: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string | null;
    reviewed_at: string | null;
};

type Filters = {
    status?: string;
    payment_method?: string;
    plan?: string;
    from?: string;
    to?: string;
};

const statusLabels: Record<string, string> = {
    pending: 'যাচাইয়ের অপেক্ষায়',
    approved: 'অনুমোদিত',
    rejected: 'প্রত্যাখ্যাত',
};

function formatDate(value: string | null) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AdminPayments({
    payments,
    filters,
}: {
    payments: Payment[];
    filters: Filters;
}) {
    const [rejecting, setRejecting] = useState<Payment | null>(null);

    function applyFilter(key: keyof Filters, value: string) {
        router.get(
            index().url,
            { ...filters, [key]: value || undefined },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="পেমেন্ট পরিচালনা" />

            <div className="space-y-6">
                <Heading
                    title="পেমেন্ট পরিচালনা"
                    description="সদস্যদের জমা দেওয়া bKash/Nagad পেমেন্ট যাচাই করুন।"
                />

                <div className="flex flex-wrap gap-3">
                    <select
                        defaultValue={filters.status ?? ''}
                        onChange={(e) => applyFilter('status', e.target.value)}
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                        <option value="">সকল অবস্থা</option>
                        <option value="pending">যাচাইয়ের অপেক্ষায়</option>
                        <option value="approved">অনুমোদিত</option>
                        <option value="rejected">প্রত্যাখ্যাত</option>
                    </select>

                    <select
                        defaultValue={filters.payment_method ?? ''}
                        onChange={(e) =>
                            applyFilter('payment_method', e.target.value)
                        }
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                        <option value="">সকল মাধ্যম</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                    </select>

                    <select
                        defaultValue={filters.plan ?? ''}
                        onChange={(e) => applyFilter('plan', e.target.value)}
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                        <option value="">সকল পরিকল্পনা</option>
                        <option value="practitioner">Practitioner</option>
                        <option value="clinic">Clinic</option>
                    </select>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-left text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            ব্যবহারকারী
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            পরিকল্পনা
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            পরিমাণ
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            মাধ্যম / লেনদেন
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            জমার সময়
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            অবস্থা
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            কার্যক্রম
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">
                                                    {payment.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {payment.workspace}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.plan}
                                            </td>
                                            <td className="px-4 py-3">
                                                ৳{payment.amount}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p>{payment.payment_method}</p>
                                                <p className="font-mono text-xs text-muted-foreground">
                                                    {payment.transaction_id}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {payment.sender_mobile}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDate(
                                                    payment.submitted_at,
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        payment.status ===
                                                        'approved'
                                                            ? 'default'
                                                            : payment.status ===
                                                                'rejected'
                                                              ? 'destructive'
                                                              : 'outline'
                                                    }
                                                >
                                                    {
                                                        statusLabels[
                                                            payment.status
                                                        ]
                                                    }
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.status ===
                                                    'pending' && (
                                                    <div className="flex gap-2">
                                                        <Form
                                                            {...approve.form(
                                                                payment.id,
                                                            )}
                                                            options={{
                                                                preserveScroll: true,
                                                            }}
                                                        >
                                                            {({
                                                                processing,
                                                            }) => (
                                                                <Button
                                                                    type="submit"
                                                                    size="sm"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                >
                                                                    অনুমোদন
                                                                </Button>
                                                            )}
                                                        </Form>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setRejecting(
                                                                    payment,
                                                                )
                                                            }
                                                        >
                                                            প্রত্যাখ্যান
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={rejecting !== null}
                onOpenChange={(open) => !open && setRejecting(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>পেমেন্ট প্রত্যাখ্যান করুন</DialogTitle>
                    </DialogHeader>

                    {rejecting && (
                        <Form
                            {...reject.form(rejecting.id)}
                            onSuccess={() => setRejecting(null)}
                            options={{ preserveScroll: true }}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="rejection_reason">
                                            প্রত্যাখ্যানের কারণ
                                        </Label>
                                        <Input
                                            id="rejection_reason"
                                            name="rejection_reason"
                                            required
                                            placeholder="যেমন: লেনদেন আইডি মিলছে না"
                                        />
                                        <InputError
                                            message={errors.rejection_reason}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={processing}
                                        >
                                            প্রত্যাখ্যান নিশ্চিত করুন
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminPayments.layout = {
    breadcrumbs: [{ title: 'পেমেন্ট পরিচালনা', href: '/admin/payments' }],
};
