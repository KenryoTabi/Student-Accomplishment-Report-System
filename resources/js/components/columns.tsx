import type { ColumnDef } from '@tanstack/react-table';
import ViewTaskDialog from '@/layouts/form/view-task-dialog';
import { Button } from './ui/button';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Task = {
    id: number;
    user?: string | null;
    description: string;
    task_date?: string | null;
    status?: string | null;
};

export type User = {
    id: string;
    name: string;
    role: string;
    section?: string;
};

export const taskColumns: ColumnDef<Task>[] = [
    {
        accessorKey: 'id',
        header: 'Task Id',
    },
    {
        accessorKey: 'user',
        header: 'User',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const task = row.original;

            return (
                <ViewTaskDialog
                    key={`${task.id}-${task.task_date ?? ''}-${task.description}`}
                    task={task}
                />
            );
        },
    },
];

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'section',
        header: 'Section',
    },
    {
        id: 'action',
        header: 'Action',
        cell: () => {
            return (
                <>
                    <Button variant="outline">Edit</Button>
                </>
            );
        },
    },
];
