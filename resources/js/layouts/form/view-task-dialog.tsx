import { useForm } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DialogLayout from '../dialog-layout';

type ViewTaskDialogProps = {
    task: {
        id: number;
        user?: string | null;
        description: string;
        task_date?: string | null;
        status?: string | null;
    };
};

type TaskFormData = {
    task_date: string;
    description: string;
};

function getInitialTaskValues(task: ViewTaskDialogProps['task']): TaskFormData {
    return {
        task_date: task.task_date ?? '',
        description: task.description,
    };
}

function parseTaskDate(taskDate?: string | null) {
    if (!taskDate) {
        return undefined;
    }

    const parsedDate = parse(taskDate, 'MM/dd/yyyy', new Date());

    if (Number.isNaN(parsedDate.getTime())) {
        return undefined;
    }

    return parsedDate;
}

export default function ViewTaskDialog({ task }: ViewTaskDialogProps) {
    const initialValues = getInitialTaskValues(task);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(() =>
        parseTaskDate(task.task_date),
    );
    const [activeAction, setActiveAction] = useState<'save' | 'delete' | null>(
        null,
    );
    const {
        data,
        setData,
        put,
        delete: destroy,
        processing,
        errors,
        clearErrors,
    } = useForm<TaskFormData>(initialValues);

    const hasChanges =
        data.task_date !== initialValues.task_date ||
        data.description !== initialValues.description;

    function resetDialog() {
        const nextValues = getInitialTaskValues(task);

        setData(nextValues);
        setSelectedDate(parseTaskDate(task.task_date));
        clearErrors();
        setActiveAction(null);
    }

    function handleDateChange(date: Date | undefined) {
        setSelectedDate(date);
        setData('task_date', date ? format(date, 'MM/dd/yyyy') : '');
    }

    return (
        <DialogLayout
            trigger={
                <Button type="button" variant="outline" size="sm">
                    Edit
                </Button>
            }
            title={`Task #${task.id}`}
            description="Review and update the selected task below."
        >
            {({ close, resetRef }) => {
                resetRef.current = resetDialog;

                function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
                    event.preventDefault();
                    setActiveAction('save');

                    put(TaskController.update.url(task.id), {
                        preserveScroll: true,
                        onSuccess: () => close(),
                        onFinish: () => setActiveAction(null),
                    });
                }

                function handleDelete() {
                    if (
                        !window.confirm(
                            'Are you sure you want to delete this task?',
                        )
                    ) {
                        return;
                    }

                    setActiveAction('delete');

                    destroy(TaskController.destroy.url(task.id), {
                        preserveScroll: true,
                        onSuccess: () => close(),
                        onFinish: () => setActiveAction(null),
                    });
                }

                return (
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`task-date-${task.id}`}>
                                    Date
                                </Label>
                                <DatePicker
                                    date={selectedDate}
                                    onChange={handleDateChange}
                                />
                                <InputError message={errors.task_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`task-user-${task.id}`}>
                                    User
                                </Label>
                                <Input
                                    id={`task-user-${task.id}`}
                                    value={task.user ?? 'N/A'}
                                    readOnly
                                />
                            </div>
                        </div>

                        {task.status && (
                            <div className="grid gap-2">
                                <Label htmlFor={`task-status-${task.id}`}>
                                    Status
                                </Label>
                                <Input
                                    id={`task-status-${task.id}`}
                                    value={task.status}
                                    readOnly
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor={`task-description-${task.id}`}>
                                Description
                            </Label>
                            <Textarea
                                id={`task-description-${task.id}`}
                                value={data.description}
                                onChange={(event) =>
                                    setData('description', event.target.value)
                                }
                                className="min-h-28 resize-none"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <DialogFooter className="gap-2 sm:justify-between">
                            <Button
                                type="button"
                                variant="destructive"
                                disabled={processing}
                                onClick={handleDelete}
                            >
                                {activeAction === 'delete'
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </Button>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    disabled={processing || !hasChanges}
                                >
                                    {activeAction === 'save'
                                        ? 'Saving...'
                                        : 'Save'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                );
            }}
        </DialogLayout>
    );
}
