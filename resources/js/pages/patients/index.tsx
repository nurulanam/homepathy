import { Head, Link } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, index } from '@/routes/patients';

type Patient = {
    id: number;
    name: string;
    phone: string | null;
    case_records_count: number;
    created_at: string;
};

export default function PatientsIndex({
    patients,
    canCreate,
}: {
    patients: Patient[];
    canCreate: boolean;
}) {
    return (
        <>
            <Head title="Patients" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Patients"
                        description={`${patients.length} patient${patients.length === 1 ? '' : 's'} in this workspace`}
                    />

                    {canCreate && (
                        <Button asChild>
                            <Link href={create()}>
                                <UserPlus />
                                New patient
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        {patients.length === 0 ? (
                            <p className="p-6 text-sm text-muted-foreground">
                                No patients yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Phone
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Cases
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Added
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {patients.map((patient) => (
                                            <tr key={patient.id}>
                                                <td className="px-4 py-3 font-medium">
                                                    {patient.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {patient.phone ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {patient.case_records_count}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(
                                                        patient.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PatientsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Patients', href: index() },
    ],
};
