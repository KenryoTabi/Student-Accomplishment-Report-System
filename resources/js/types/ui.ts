import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};

export type DialogProps = {
    trigger: ReactNode;
    title: string;
    description?: string;
    children: (args: {
        close: () => void;
        resetRef: React.RefObject<(() => void) | null>;
    }) => ReactNode;
};
