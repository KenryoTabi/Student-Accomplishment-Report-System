import { Head } from "@inertiajs/react";

import { dashboard } from "@/routes";
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { taskColumns } from '@/components/columns';

export default function StudentDashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className="flex text-xl font-semibold align-middle justify-center w-full">Total Users</Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className="flex text-xl font-semibold align-middle justify-center w-full">Total Accomplishments</Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className="flex text-xl font-semibold align-middle justify-center w-full">Reports This Period</Label>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">                    
                    
                    
                    <DataTable columns={taskColumns} data={[]}/>

                </div>
            </div>
        </>
    );
}

StudentDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
}