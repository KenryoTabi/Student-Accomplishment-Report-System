import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';
import { DateRange } from 'react-day-picker';

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

export type DatePickerProps = {
    title: string;
    date: DateRange | undefined;
    onChange: (date: DateRange | undefined) => void;
};
