import { Form, Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/CaseRecordController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { create, index } from '@/routes/cases';

type Patient = { id: number; name: string };

export default function CasesCreate({ patients }: { patients: Patient[] }) {
    return (
        <>
            <Head title="নতুন কেস" />

            <div className="max-w-xl space-y-6">
                <Heading
                    title="নতুন কেস"
                    description="একজন রোগীর জন্য নতুন কেস রেকর্ড করুন।"
                />

                <Card>
                    <CardContent>
                        <Form {...store.form()} className="space-y-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="patient_id">
                                            রোগী
                                        </Label>
                                        <select
                                            id="patient_id"
                                            name="patient_id"
                                            required
                                            defaultValue=""
                                            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                        >
                                            <option value="" disabled>
                                                একজন রোগী নির্বাচন করুন
                                            </option>
                                            {patients.map((patient) => (
                                                <option
                                                    key={patient.id}
                                                    value={patient.id}
                                                >
                                                    {patient.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.patient_id}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="title">
                                            শিরোনাম
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="notes">নোট</Label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={4}
                                            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        কেস সংরক্ষণ করুন
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CasesCreate.layout = {
    breadcrumbs: [
        { title: 'ড্যাশবোর্ড', href: dashboard() },
        { title: 'কেস', href: index() },
        { title: 'নতুন কেস', href: create() },
    ],
};
