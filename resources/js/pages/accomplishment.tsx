import { Form, Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

import { accomplishment } from '@/routes';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { taskColumns, Task  } from '@/components/columns';
import { useRole } from '@/hooks/use-role';
import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogTitle, 
    DialogTrigger } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/password-input';
import { Input } from '@headlessui/react';
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { CirclePlusIcon, Plus, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { AccomplishmentForm } from '@/layouts/form/add-accomplishment-form';

function getData(): Task[] {

  return [
  ]
}

export default function Accomplishment() {
    const { roleId } = useRole();

    const resetFormRef = useRef<(() => void) | null>(null);
    

    function handleDialogOpenChange(open: boolean): void {
        if (!open) {
            resetFormRef.current?.();
        }

        setDialogOpen(open);
    }

    const [dialogOpen, setDialogOpen] = useState(false);
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
                <div className='flex gap-4 w-full'>
                    <div className='flex-1'>
                        <Input placeholder='Search Users' className='w-full rounded-lg border border-sidebar-border/70 dark:border-sidebar-border bg-transparent py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary' />
                    </div>
                    <div className='ml-auto'>
                        <Link 
                            className='flex flex-row gap-2 text-black bg-white py-2 px-4 cursor-pointer rounded-lg border text-sm font-sm align-center' 
                            as='button'
                        ><Search className='size-5'/></Link>
                    </div>
                    
                    <AccomplishmentForm/>
                    
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">                    
                    
                    <DataTable columns={taskColumns} data={getData()}>

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


