import { createDatasetPreference } from '@/hooks/use-dataset-preference';

export type AccentColor = 'teal' | 'blue' | 'purple' | 'orange' | 'rose';

export const ACCENT_COLORS: { value: AccentColor; label: string }[] = [
    { value: 'teal', label: 'টিল' },
    { value: 'blue', label: 'নীল' },
    { value: 'purple', label: 'বেগুনি' },
    { value: 'orange', label: 'কমলা' },
    { value: 'rose', label: 'গোলাপি' },
];

const accentColorPreference = createDatasetPreference<AccentColor>({
    storageKey: 'accent_color',
    datasetKey: 'accent',
    defaultValue: 'teal',
    preferenceField: 'accent_color',
});

export const initializeAccentColor = accentColorPreference.initialize;

export function useAccentColor() {
    const [accentColor, updateAccentColor] = accentColorPreference.useValue();

    return { accentColor, updateAccentColor } as const;
}
