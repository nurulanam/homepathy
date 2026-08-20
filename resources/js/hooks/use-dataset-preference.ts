import { useSyncExternalStore } from 'react';
import { getInitialPreferences, syncPreference } from '@/lib/preferences';

/**
 * Shared factory for a preference that is stored as a single string,
 * applied to <html> via a data-* attribute, persisted to localStorage,
 * and synced to the server for signed-in users. use-appearance.tsx has
 * its own implementation because it also resolves 'system' via a media
 * query listener.
 */
export function createDatasetPreference<T extends string>(config: {
    storageKey: string;
    datasetKey: string;
    defaultValue: T;
    preferenceField: 'accent_color' | 'font_family';
}) {
    const listeners = new Set<() => void>();
    let current: T = config.defaultValue;

    const applyValue = (value: T): void => {
        if (typeof document === 'undefined') {
            return;
        }

        document.documentElement.dataset[config.datasetKey] = value;
    };

    const subscribe = (callback: () => void) => {
        listeners.add(callback);

        return () => listeners.delete(callback);
    };

    const notify = (): void => listeners.forEach((listener) => listener());

    const initialize = (): void => {
        if (typeof window === 'undefined') {
            return;
        }

        const dbValue = getInitialPreferences()?.[
            config.preferenceField
        ] as T | undefined;

        const stored =
            dbValue ??
            (localStorage.getItem(config.storageKey) as T | null) ??
            config.defaultValue;

        localStorage.setItem(config.storageKey, stored);
        current = stored;
        applyValue(current);
    };

    const useValue = () => {
        const value = useSyncExternalStore(
            subscribe,
            () => current,
            () => config.defaultValue,
        );

        const updateValue = (next: T): void => {
            current = next;
            localStorage.setItem(config.storageKey, next);
            applyValue(next);
            syncPreference(config.preferenceField, next);
            notify();
        };

        return [value, updateValue] as const;
    };

    return { initialize, useValue };
}
