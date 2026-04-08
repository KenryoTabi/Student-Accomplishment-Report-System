import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

import { accomplishment } from '@/routes';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { columns, Payment } from '@/components/columns';

export default function Accomplishment() {
    return (
        <>
            <Head title="Accomplishment" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className='text-xl font-semibold align-middle'>Total Users</Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className='text-xl font-semibold align-middle'>Total Accomplishments</Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className='text-xl font-semibold align-middle'>Reports This Period</Label>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">                    
                    
                    
                    <DataTable columns={columns} data={getData()}>

                    </DataTable>
                </div>
            </div>
        </>
    );
}

Accomplishment.layout = {
    breadcrumbs: [
        {
            title: 'Accomplishment',
            href: accomplishment(),
        },
    ],
};

function getData(): Payment[] {

  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ]
}
