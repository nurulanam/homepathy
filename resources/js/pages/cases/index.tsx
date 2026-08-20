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
            <Head title="কেস" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="কেস"
                        description={`${cases.length}টি কেস রেকর্ড করা হয়েছে`}
                    />

                    {canCreate && (
                        <Button asChild>
                            <Link href={create()}>
                                <FilePlus2 />
                                নতুন কেস
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        {cases.length === 0 ? (
                            <p className="p-6 text-sm text-muted-foreground">
                                এখনো কোনো কেস নেই।
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">
                                                রোগী
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                শিরোনাম
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                যোগ করা হয়েছে
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
        { title: 'ড্যাশবোর্ড', href: dashboard() },
        { title: 'কেস', href: index() },
    ],
};
