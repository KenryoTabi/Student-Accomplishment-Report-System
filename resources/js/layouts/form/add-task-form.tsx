import { Form } from '@inertiajs/react';
import { format } from 'date-fns';
import { CirclePlusIcon, MinusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DialogLayout from '../dialog-layout';

export function TaskForm() {
    const [date, setDate] = useState<Date | undefined>(() => new Date());
    const [taskRows, setTaskRows] = useState([0]);
    const [nextRowId, setNextRowId] = useState(1);
    const formattedDate = date ? format(date, 'MM/dd/yyyy') : '';

    function addTaskRow() {
        setTaskRows((currentRows) => [...currentRows, nextRowId]);
        setNextRowId((currentId) => currentId + 1);
    }

    function removeTaskRow(rowId: number) {
        setTaskRows((currentRows) =>
            currentRows.filter((currentRowId) => currentRowId !== rowId),
        );
    }

    return (
        <DialogLayout
            trigger={
                <Button>
                    <CirclePlusIcon className="size-5" />
                    Task
                </Button>
            }
            title="Create Task"
            description="Add a new task to the system. Fill in the details below."
        >
            {({ close, resetRef }) => (
                <Form
                    {...TaskController.store.form()}
                    onSuccess={() => close()}
                >
                    {({ resetAndClearErrors, processing, errors }) => {
                        resetRef.current = () => {
                            resetAndClearErrors();
                            setDate(new Date());
                            setTaskRows([0]);
                            setNextRowId(1);
                        };

                        return (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <DatePicker
                                        date={date}
                                        onChange={setDate}
                                    />
                                    {formattedDate && (
                                        <input
                                            type="hidden"
                                            name="task_date"
                                            value={formattedDate}
                                        />
                                    )}
                                    <InputError message={errors.task_date} />
                                </div>

                                {formattedDate && (
                                    <div className="flex flex-col gap-3">
                                        {taskRows.map((rowId, index) => (
                                            <div
                                                key={rowId}
                                                className="flex flex-row items-center gap-2"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <Label
                                                        htmlFor={`accomplishment-${rowId}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        Task {index + 1}
                                                    </Label>
                                                </div>

                                                <div className="flex flex-1 flex-col gap-1">
                                                    <Textarea
                                                        id={`task-${rowId}`}
                                                        name="tasks[]"
                                                        placeholder="Enter task"
                                                        className="w-full resize-none rounded border px-3 py-2 break-words whitespace-normal focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                                    />

                                                    <InputError
                                                        message={
                                                            errors[
                                                                `tasks.${index}`
                                                            ]
                                                                ? 'Cannot add an empty task'
                                                                : errors.tasks
                                                        }
                                                    />
                                                </div>

                                                {index > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeTaskRow(rowId)
                                                        }
                                                    >
                                                        <MinusCircleIcon className="size-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addTaskRow}
                                        >
                                            Add another task
                                        </Button>
                                    </div>
                                )}

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </div>
                        );
                    }}
                </Form>
            )}
        </DialogLayout>
    );
}
