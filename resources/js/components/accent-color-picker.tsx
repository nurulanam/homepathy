import { CheckIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { ACCENT_COLORS, useAccentColor } from '@/hooks/use-accent-color';
import { cn } from '@/lib/utils';

const SWATCH_CLASSES: Record<string, string> = {
    teal: 'bg-[oklch(0.51_0.09_179)]',
    blue: 'bg-[oklch(0.55_0.22_258)]',
    purple: 'bg-[oklch(0.54_0.24_293)]',
    orange: 'bg-[oklch(0.65_0.19_43)]',
    rose: 'bg-[oklch(0.59_0.22_15)]',
};

export default function AccentColorPicker({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { accentColor, updateAccentColor } = useAccentColor();

    return (
        <div className={cn('flex flex-wrap gap-3', className)} {...props}>
            {ACCENT_COLORS.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    aria-label={label}
                    onClick={() => updateAccentColor(value)}
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-105',
                        SWATCH_CLASSES[value],
                        accentColor === value && 'ring-2 ring-foreground',
                    )}
                >
                    {accentColor === value && (
                        <CheckIcon className="h-4 w-4 text-white" />
                    )}
                </button>
            ))}
        </div>
    );
}
