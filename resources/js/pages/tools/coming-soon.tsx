import { Head, Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function ToolComingSoon({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <>
            <Head title={title} />

            <div className="flex flex-1 items-center justify-center">
                <Card className="max-w-md text-center">
                    <CardContent className="space-y-3">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Sparkles className="size-6" />
                        </div>
                        <Badge variant="secondary">শীঘ্রই আসছে</Badge>
                        <h1 className="text-xl font-semibold">{title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                        <Link
                            href={dashboard()}
                            className="inline-block text-sm text-primary hover:underline"
                        >
                            ড্যাশবোর্ডে ফিরুন
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ToolComingSoon.layout = {
    breadcrumbs: [{ title: 'ড্যাশবোর্ড', href: dashboard() }],
};
