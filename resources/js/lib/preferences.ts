import { router } from '@inertiajs/react';

export type StoredPreferences = {
    theme?: string;
    accent_color?: string;
    font_family?: string;
};

/**
 * Reads the preferences Inertia shared prop straight out of the page's
 * data-page attribute, so it's available before React has mounted/hydrated.
 */
export function getInitialPreferences(): StoredPreferences | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const raw = document.getElementById('app')?.getAttribute('data-page');

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw)?.props?.preferences ?? null;
    } catch {
        return null;
    }
}

/**
 * Persists a single appearance field for signed-in users. Guests keep
 * their preference in localStorage/cookies only.
 */
export function syncPreference(
    field: 'theme' | 'accent_color' | 'font_family',
    value: string,
): void {
    if (typeof window === 'undefined' || getInitialPreferences() === null) {
        return;
    }

    router.patch(
        '/settings/appearance',
        { [field]: value },
        { preserveScroll: true, preserveState: true, showProgress: false },
    );
}
