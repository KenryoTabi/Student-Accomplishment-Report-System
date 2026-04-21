import type { ColumnDef } from '@tanstack/react-table';
import ViewAccomplishmentReportDialog from '@/layouts/form/view-accomplishment-report-dialog';
import ViewTaskDialog from '@/layouts/form/view-task-dialog';
import { Button } from './ui/button';
import {Task} from "@/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.



export type AccomplishmentReport = {
    id: number;
    report_code: string;
    user_id: number;
    author?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    supervisor_id?: number | null;
    supervisor_name?: string | null;
    period?: string | null;
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
        accessorKey: 'task_date',
        header: 'Date',
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

export const accomplishmentReportColumns: ColumnDef<AccomplishmentReport>[] = [
    {
        accessorKey: 'report_code',
        header: 'Report Code',
    },
    {
        accessorKey: 'author',
        header: 'Author',
    },
    {
        accessorKey: 'period',
        header: 'Period',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const report = row.original;

            return <ViewAccomplishmentReportDialog report={report} />;
        },
    },
];
