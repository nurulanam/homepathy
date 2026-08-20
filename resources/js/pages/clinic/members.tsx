import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    destroy,
    invite,
    updateRole,
} from '@/actions/App/Http/Controllers/WorkspaceMemberController';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Member = {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'practitioner' | 'assistant' | 'receptionist';
    status: 'accepted' | 'pending';
    joined_at: string | null;
};

type Props = {
    members: Member[];
    seats: {
        included: number;
        used: number;
        additional: number;
        additional_price: number;
    };
    isOwner: boolean;
};

const roleLabels: Record<Member['role'], string> = {
    owner: 'মালিক',
    practitioner: 'প্র্যাকটিশনার',
    assistant: 'সহকারী',
    receptionist: 'রিসেপশনিস্ট',
};

export default function ClinicMembers({ members, seats, isOwner }: Props) {
    const [inviteOpen, setInviteOpen] = useState(false);

    return (
        <>
            <Head title="ক্লিনিক সদস্য" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="ক্লিনিক সদস্য"
                        description={`${seats.used} / ${seats.included} অন্তর্ভুক্ত আসন ব্যবহৃত হচ্ছে`}
                    />

                    {isOwner && (
                        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                            <DialogTrigger asChild>
                                <Button>সদস্য আমন্ত্রণ করুন</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        নতুন সদস্য আমন্ত্রণ
                                    </DialogTitle>
                                </DialogHeader>

                                <Form
                                    {...invite.form()}
                                    onSuccess={() => setInviteOpen(false)}
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    ইমেইল ঠিকানা
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    placeholder="doctor@example.com"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="role">
                                                    ভূমিকা
                                                </Label>
                                                <select
                                                    id="role"
                                                    name="role"
                                                    defaultValue="practitioner"
                                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                                >
                                                    <option value="practitioner">
                                                        প্র্যাকটিশনার
                                                    </option>
                                                    <option value="assistant">
                                                        সহকারী
                                                    </option>
                                                    <option value="receptionist">
                                                        রিসেপশনিস্ট
                                                    </option>
                                                </select>
                                                <InputError
                                                    message={errors.role}
                                                />
                                            </div>

                                            {seats.additional > 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    বর্তমানে {seats.additional}{' '}
                                                    টি অতিরিক্ত আসন ব্যবহৃত
                                                    হচ্ছে, প্রতি আসন ৳
                                                    {seats.additional_price} /
                                                    মাস।
                                                </p>
                                            )}

                                            <DialogFooter>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    আমন্ত্রণ পাঠান
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-left text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            নাম
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            ভূমিকা
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            অবস্থা
                                        </th>
                                        {isOwner && (
                                            <th className="px-4 py-3 font-medium">
                                                কার্যক্রম
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">
                                                    {member.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {member.email}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {isOwner &&
                                                member.role !== 'owner' ? (
                                                    <Form
                                                        {...updateRole.form(
                                                            member.id,
                                                        )}
                                                        options={{
                                                            preserveScroll: true,
                                                        }}
                                                    >
                                                        <select
                                                            name="role"
                                                            defaultValue={
                                                                member.role
                                                            }
                                                            onChange={(e) =>
                                                                e.target.form?.requestSubmit()
                                                            }
                                                            className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                                                        >
                                                            <option value="practitioner">
                                                                প্র্যাকটিশনার
                                                            </option>
                                                            <option value="assistant">
                                                                সহকারী
                                                            </option>
                                                            <option value="receptionist">
                                                                রিসেপশনিস্ট
                                                            </option>
                                                        </select>
                                                    </Form>
                                                ) : (
                                                    roleLabels[member.role]
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        member.status ===
                                                        'accepted'
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    {member.status ===
                                                    'accepted'
                                                        ? 'সক্রিয়'
                                                        : 'আমন্ত্রণ পাঠানো হয়েছে'}
                                                </Badge>
                                            </td>
                                            {isOwner && (
                                                <td className="px-4 py-3">
                                                    {member.role !==
                                                        'owner' && (
                                                        <Form
                                                            {...destroy.form(
                                                                member.id,
                                                            )}
                                                        >
                                                            {({
                                                                processing,
                                                            }) => (
                                                                <Button
                                                                    type="submit"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                >
                                                                    অপসারণ করুন
                                                                </Button>
                                                            )}
                                                        </Form>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ClinicMembers.layout = {
    breadcrumbs: [{ title: 'ক্লিনিক সদস্য', href: '/clinic/members' }],
};
