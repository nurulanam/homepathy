import type { HTMLAttributes } from 'react';
import { FONT_FAMILIES, useFontFamily } from '@/hooks/use-font-family';
import { cn } from '@/lib/utils';

export default function FontFamilyPicker({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { fontFamily, updateFontFamily } = useFontFamily();

    return (
        <div className={cn('grid gap-2 sm:grid-cols-2', className)} {...props}>
            {FONT_FAMILIES.map(({ value, label, sample }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => updateFontFamily(value)}
                    className={cn(
                        'rounded-lg border px-4 py-3 text-left transition-colors',
                        sample,
                        fontFamily === value
                            ? 'border-primary bg-accent'
                            : 'border-border hover:bg-accent/60',
                    )}
                >
                    <div className="text-sm text-muted-foreground">{label}</div>
                    <div className="text-lg">Aa Bb Cc</div>
                </button>
            ))}
        </div>
    );
}
