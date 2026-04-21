import { Head, Link, router, usePage } from '@inertiajs/react';

import { accomplishmentReport } from '@/routes';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import {
    AccomplishmentReport,
    accomplishmentReportColumns,
} from '@/components/columns';
import { useRole } from '@/hooks/use-role';
import { Input } from '@headlessui/react';
import { Search } from 'lucide-react';
import { GenerateAccomplishmentForm } from '@/layouts/form/generate-accomplishment-form';
import { PaginatedResponse } from '@/types';
import SmartPagination from '@/components/app-pagination';

type PageProps = {
    reports: PaginatedResponse<AccomplishmentReport>;
};

export default function UserAccomplishment() {
    const { reports } = usePage<PageProps>().props;
    const { isAdmin } = useRole();

    function getData() {
        return reports.data;
    }

    const changePage = (page: number) => {
        router.get('/accomplishment-report', {
                page
            }, {
                preserveState: true,
                replace: false
            });
        };

    return (
        <>
            <Head title="Accomplishments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className="align-middle text-xl font-semibold">
                            Total Users
                        </Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className="align-middle text-xl font-semibold">
                            Total Accomplishments
                        </Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className="align-middle text-xl font-semibold">
                            Reports This Period
                        </Label>
                    </div>
                </div>
                <div className="flex w-full gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search Users"
                            className="w-full rounded-lg border border-sidebar-border/70 bg-transparent px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none dark:border-sidebar-border"
                        />
                    </div>
                    <div className="ml-auto">
                        <Link
                            className="font-sm align-center flex cursor-pointer flex-row gap-2 rounded-lg border bg-white px-4 py-2 text-sm text-black"
                            as="button"
                        >
                            <Search className="size-5" />
                        </Link>
                    </div>

                    {!isAdmin && <GenerateAccomplishmentForm />}
                </div>

                <DataTable
                    columns={accomplishmentReportColumns}
                    data={getData()}
                />

                <SmartPagination currentPage={reports.current_page} lastPage={reports.last_page} onPageChange={changePage} />

            </div>
        </>
    );
}

UserAccomplishment.layout = {
    breadcrumbs: [
        {
            title: 'User Accomplishments',
            href: accomplishmentReport(),
        },
    ],
};
