import { Head } from '@inertiajs/react';
import AccentColorPicker from '@/components/accent-color-picker';
import AppearanceTabs from '@/components/appearance-tabs';
import FontFamilyPicker from '@/components/font-family-picker';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-8">
                <Heading
                    variant="small"
                    title="Appearance settings"
                    description="Update the appearance settings for your account"
                />

                <div className="space-y-2">
                    <h2 className="text-sm font-medium">Theme</h2>
                    <AppearanceTabs />
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm font-medium">Accent color</h2>
                    <AccentColorPicker />
                </div>

                <div className="space-y-2">
                    <h2 className="text-sm font-medium">Font</h2>
                    <FontFamilyPicker />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
