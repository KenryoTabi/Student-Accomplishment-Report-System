export type Task = {
    id: number;
    user_id?: number;
    report_id?: number | null;
    user?: string | null;
    description: string;
    task_date?: string | null;
    status?: string | null;
};