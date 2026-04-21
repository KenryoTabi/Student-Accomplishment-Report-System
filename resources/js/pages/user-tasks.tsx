import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

import { userTasks } from '@/routes';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { taskColumns } from '@/components/columns';
import { useRole } from '@/hooks/use-role';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/password-input';
import { Input } from '@headlessui/react';
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';
import { CirclePlusIcon, Plus, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { TaskForm } from '@/layouts/form/add-task-form';
import {PaginatedResponse, Task} from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import SmartPagination from '@/components/app-pagination';


type PageProps = {
    tasks: PaginatedResponse<Task>
}
export default function UserTasks() {
    const { tasks } = usePage<PageProps>().props;

    function getData(): Task[] {
        return tasks.data;
    }

    

    const changePage = (page: number) => {
    router.get('/user-tasks', {
            page
        }, {
            preserveState: true,
            replace: false
        });
    };

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
                <SmartPagination currentPage={tasks.current_page} lastPage={tasks.last_page} onPageChange={changePage} />
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


