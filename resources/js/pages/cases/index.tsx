import { Head, Link } from '@inertiajs/react';
import { FilePlus2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, index } from '@/routes/cases';

type CaseRecord = {
    id: number;
    title: string;
    notes: string | null;
    patient: string;
    created_at: string;
};

export default function CasesIndex({
    cases,
    canCreate,
}: {
    cases: CaseRecord[];
    canCreate: boolean;
}) {
    return (
        <>
            <Head title="Cases" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Cases"
                        description={`${cases.length} case${cases.length === 1 ? '' : 's'} recorded`}
                    />

                    {canCreate && (
                        <Button asChild>
                            <Link href={create()}>
                                <FilePlus2 />
                                New case
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        {cases.length === 0 ? (
                            <p className="p-6 text-sm text-muted-foreground">
                                No cases yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">
                                                Patient
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Title
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Added
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {cases.map((c) => (
                                            <tr key={c.id}>
                                                <td className="px-4 py-3 font-medium">
                                                    {c.patient}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {c.title}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(
                                                        c.created_at,
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

CasesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Cases', href: index() },
    ],
};
