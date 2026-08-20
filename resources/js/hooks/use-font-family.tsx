import { createDatasetPreference } from '@/hooks/use-dataset-preference';

export type FontFamily = 'instrument' | 'inter' | 'lora' | 'jetbrains-mono';

export const FONT_FAMILIES: { value: FontFamily; label: string; sample: string }[] =
    [
        { value: 'instrument', label: 'Instrument Sans', sample: 'font-instrument' },
        { value: 'inter', label: 'Inter', sample: 'font-inter' },
        { value: 'lora', label: 'Lora', sample: 'font-lora' },
        { value: 'jetbrains-mono', label: 'JetBrains Mono', sample: 'font-jetbrains-mono' },
    ];

const fontFamilyPreference = createDatasetPreference<FontFamily>({
    storageKey: 'font_family',
    datasetKey: 'font',
    defaultValue: 'instrument',
    preferenceField: 'font_family',
});

export const initializeFontFamily = fontFamilyPreference.initialize;

export function useFontFamily() {
    const [fontFamily, updateFontFamily] = fontFamilyPreference.useValue();

    return { fontFamily, updateFontFamily } as const;
}
