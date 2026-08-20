import { Form, Head } from '@inertiajs/react';
import { accept } from '@/actions/App/Http/Controllers/ClinicInvitationController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Invitation = {
    id: number;
    workspace_name: string;
    role: 'practitioner' | 'assistant' | 'receptionist';
};

const roleLabels: Record<Invitation['role'], string> = {
    practitioner: 'প্র্যাকটিশনার',
    assistant: 'সহকারী',
    receptionist: 'রিসেপশনিস্ট',
};

export default function ClinicInvitations({
    invitations,
}: {
    invitations: Invitation[];
}) {
    return (
        <>
            <Head title="ক্লিনিক আমন্ত্রণ" />

            <div className="max-w-lg space-y-6">
                <Heading
                    title="ক্লিনিক আমন্ত্রণ"
                    description="আপনাকে যেসব ক্লিনিকে যোগ দেওয়ার আমন্ত্রণ জানানো হয়েছে।"
                />

                {invitations.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        এই মুহূর্তে কোনো অপেক্ষমাণ আমন্ত্রণ নেই।
                    </p>
                )}

                <div className="space-y-3">
                    {invitations.map((invitation) => (
                        <Card key={invitation.id}>
                            <CardContent className="flex items-center justify-between pt-6">
                                <div>
                                    <p className="font-medium">
                                        {invitation.workspace_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        ভূমিকা: {roleLabels[invitation.role]}
                                    </p>
                                </div>

                                <Form
                                    {...accept.form(invitation.id)}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            গ্রহণ করুন
                                        </Button>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

ClinicInvitations.layout = {
    breadcrumbs: [{ title: 'ক্লিনিক আমন্ত্রণ', href: '/clinic/invitations' }],
};
