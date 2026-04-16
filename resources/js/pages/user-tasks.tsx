import { Form, Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

import { userTasks } from '@/routes';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { taskColumns, Task  } from '@/components/columns';
import { useRole } from '@/hooks/use-role';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/password-input';
import { Input } from '@headlessui/react';
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { CirclePlusIcon, Plus, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { TaskForm } from '@/layouts/form/add-task-form';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


type PageProps = {
    tasks: Task[]
}
export default function UserTasks() {
    function getData(): Task[] {
        const { tasks } = usePage<PageProps>().props;
        return tasks;
    }

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
            <Head title="Task" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className='text-xl font-semibold align-middle'></Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Label className='text-xl font-semibold align-middle'>Total Tasks</Label>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Label className='text-xl font-semibold align-middle'>Tasks This Quarter</Label>
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
                    
                    <TaskForm/>
                    
                </div>

                <DataTable columns={taskColumns} data={getData()}/>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                        <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                    </Pagination>
                 
            </div>
        </>
    );
}

UserTasks.layout = {
    breadcrumbs: [
        {
            title: 'User Tasks',
            href: userTasks(),
        },
    ],
};


