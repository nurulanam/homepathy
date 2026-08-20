import type { Auth, CurrentWorkspace } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            workspace: CurrentWorkspace | null;
            pendingInvitationsCount: number;
            sidebarOpen: boolean;
            preferences: {
                theme: string;
                accent_color: string;
                font_family: string;
            } | null;
            [key: string]: unknown;
        };
    }
}
