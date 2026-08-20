import { Form, Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/PatientController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { create, index } from '@/routes/patients';

export default function PatientsCreate() {
    return (
        <>
            <Head title="নতুন রোগী" />

            <div className="max-w-xl space-y-6">
                <Heading
                    title="নতুন রোগী"
                    description="এই ওয়ার্কস্পেসে একজন রোগী যুক্ত করুন।"
                />

                <Card>
                    <CardContent>
                        <Form {...store.form()} className="space-y-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">নাম</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">ফোন</Label>
                                        <Input id="phone" name="phone" />
                                        <InputError message={errors.phone} />
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
                                        রোগী সংরক্ষণ করুন
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

PatientsCreate.layout = {
    breadcrumbs: [
        { title: 'ড্যাশবোর্ড', href: dashboard() },
        { title: 'রোগী', href: index() },
        { title: 'নতুন রোগী', href: create() },
    ],
};
