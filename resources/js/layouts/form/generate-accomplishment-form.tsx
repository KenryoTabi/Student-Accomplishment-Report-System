import { Form, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { format } from 'date-fns';

import { CirclePlusIcon } from 'lucide-react';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import DialogLayout from '../dialog-layout';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import AccomplishmentReportController from '@/actions/App/Http/Controllers/AccomplishmentReportController';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/components/columns';

type PageProps = {
    tasks: Task[];
};

export function GenerateAccomplishmentForm() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const { tasks } = usePage<PageProps>().props;

    function getDatesBetween(from: Date, to: Date): Date[] {
        const dates: Date[] = [];
        const current = new Date(from);
        const last = new Date(to);

        current.setHours(0, 0, 0, 0);
        last.setHours(0, 0, 0, 0);

        while (current <= last) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }

    const dates =
        dateRange?.from && dateRange?.to
            ? getDatesBetween(dateRange.from, dateRange.to)
            : [];

    const tasksByDate = tasks.reduce<Record<string, string[]>>(
        (groupedTasks, task) => {
            if (!task.task_date || task.report_id != null) {
                return groupedTasks;
            }

            groupedTasks[task.task_date] ??= [];
            groupedTasks[task.task_date].push(task.description);

            return groupedTasks;
        },
        {},
    );

    const dateRangeKey =
        dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, 'yyyy-MM-dd')}-${format(dateRange.to, 'yyyy-MM-dd')}`
            : 'empty';

    return (
        <>
            <DialogLayout
                trigger={
                    <Button className="">
                        <CirclePlusIcon className="size-5" />
                        Accomplishment
                    </Button>
                }
                title="Create Accomplishment"
                description="Add a new accomplishment to the system. Fill in the details below."
            >
                {({ close, resetRef }) => (
                    <Form
                        {...AccomplishmentReportController.store.form()}
                        onSuccess={() => close()}
                    >
                        {({ resetAndClearErrors, processing, errors }) => {
                            resetRef.current = () => {
                                resetAndClearErrors();
                                setDateRange(undefined);
                            };

                            return (
                                <>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-4">
                                            <DatePickerWithRange
                                                title=""
                                                date={dateRange}
                                                onChange={setDateRange}
                                            />
                                            {dates.length > 0 && (
                                                <input
                                                    type="hidden"
                                                    name="task_date"
                                                    value={dates
                                                        .map((date) =>
                                                            format(
                                                                date,
                                                                'MM/dd/yyyy',
                                                            ),
                                                        )
                                                        .join(',')}
                                                />
                                            )}
                                            <InputError
                                                message={errors.task_date}
                                            />
                                        </div>
                                        {dates.map((date) => {
                                            const formatted = format(
                                                date,
                                                'MM/dd/yyyy',
                                            );

                                            const isWeekend =
                                                date.getDay() == 0 ||
                                                date.getDay() == 6;
                                            const dateLabel =
                                                date.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        weekday: 'long',
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    },
                                                ) +
                                                (isWeekend
                                                    ? ' (Optional)'
                                                    : '');

                                            const accomplishments =
                                                tasksByDate[formatted] ?? [];
                                            const generatedValue =
                                                accomplishments
                                                    .map(
                                                        (description) =>
                                                            `- ${description}`,
                                                    )
                                                    .join('\n');

                                            return (
                                                <div
                                                    key={`${dateRangeKey}-${formatted}`}
                                                    className="flex flex-col gap-2"
                                                >
                                                    <Label
                                                        htmlFor={`accomplishment-${formatted}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        {dateLabel}
                                                    </Label>

                                                    <Textarea
                                                        id={`accomplishment-${formatted}`}
                                                        name={`accomplishments[${formatted}]`}
                                                        className="w-full resize-none rounded border px-3 py-2 break-words whitespace-normal focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                                        readOnly
                                                        defaultValue={
                                                            generatedValue
                                                        }
                                                        placeholder={
                                                            accomplishments.length >
                                                            0
                                                                ? 'Review the generated accomplishments'
                                                                : 'Enter accomplishment'
                                                        }
                                                    />

                                                    <InputError
                                                        message={
                                                            errors[
                                                                `accomplishments.${formatted}`
                                                            ]
                                                                ? 'Accomplishment is required for this date'
                                                                : errors.accomplishments
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                        <DialogFooter className="gap-2">
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    dates.length === 0
                                                }
                                            >
                                                Generate Accomplishment
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </>
                            );
                        }}
                    </Form>
                )}
            </DialogLayout>
        </>
    );
}
