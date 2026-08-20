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
            <Head title="New case" />

            <div className="max-w-xl space-y-6">
                <Heading
                    title="New case"
                    description="Record a new case for a patient."
                />

                <Card>
                    <CardContent>
                        <Form {...store.form()} className="space-y-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="patient_id">
                                            Patient
                                        </Label>
                                        <select
                                            id="patient_id"
                                            name="patient_id"
                                            required
                                            defaultValue=""
                                            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                        >
                                            <option value="" disabled>
                                                Select a patient
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
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={4}
                                            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        Save case
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
        { title: 'Dashboard', href: dashboard() },
        { title: 'Cases', href: index() },
        { title: 'New case', href: create() },
    ],
};
