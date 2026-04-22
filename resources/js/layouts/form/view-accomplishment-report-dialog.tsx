import AccomplishmentReportController from '@/actions/App/Http/Controllers/AccomplishmentReportController';
import type { AccomplishmentReport } from '@/components/columns';
import { Task } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useRole } from '@/hooks/use-role';
import { useForm, usePage } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { FileDown, Printer } from 'lucide-react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { DateRange } from 'react-day-picker';
import DialogLayout from '../dialog-layout';

type ViewAccomplishmentReportDialogProps = {
    report: AccomplishmentReport;
};

type SupervisorOption = {
    id: number;
    name: string;
};

type PageProps = {
    tasks: Task[];
    supervisors: SupervisorOption[];
};

type ReportFormData = {
    task_date: string;
    supervised_by: string;
};

const UNASSIGNED_SUPERVISOR = '__unassigned__';

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

function parseDisplayDate(value?: string | null) {
    if (!value) {
        return undefined;
    }

    const parsedDate = parse(value, 'MM/dd/yyyy', new Date());

    if (Number.isNaN(parsedDate.getTime())) {
        return undefined;
    }

    return parsedDate;
}

function getInitialDateRange(
    report: AccomplishmentReport,
): DateRange | undefined {
    const from = parseDisplayDate(report.start_date);
    const to = parseDisplayDate(report.end_date);

    if (!from || !to) {
        return undefined;
    }

    return { from, to };
}

function serializeDateRange(dateRange: DateRange | undefined): string {
    if (!dateRange?.from || !dateRange?.to) {
        return '';
    }

    return getDatesBetween(dateRange.from, dateRange.to)
        .map((date) => format(date, 'MM/dd/yyyy'))
        .join(',');
}

function getInitialReportValues(
    report: AccomplishmentReport,
    dateRange: DateRange | undefined,
): ReportFormData {
    return {
        task_date: serializeDateRange(dateRange),
        supervised_by: report.supervisor_id ? String(report.supervisor_id) : '',
    };
}

export default function ViewAccomplishmentReportDialog({
    report,
}: ViewAccomplishmentReportDialogProps) {
    const { tasks, supervisors } = usePage<PageProps>().props;
    const { isAdmin } = useRole();
    const initialDateRange = getInitialDateRange(report);
    const initialValues = getInitialReportValues(report, initialDateRange);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialDateRange,
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
    } = useForm<ReportFormData>(initialValues);

    const selectedDates =
        dateRange?.from && dateRange?.to
            ? getDatesBetween(dateRange.from, dateRange.to)
            : [];
    const selectedDateKeys = new Set(
        selectedDates.map((date) => format(date, 'MM/dd/yyyy')),
    );

    const selectedTasks = tasks
        .filter((task) => {
            return (
                task.user_id === report.user_id &&
                task.task_date &&
                selectedDateKeys.has(task.task_date)
            );
        })
        .sort((leftTask, rightTask) => {
            const leftDate =
                parseDisplayDate(leftTask.task_date)?.getTime() ?? 0;
            const rightDate =
                parseDisplayDate(rightTask.task_date)?.getTime() ?? 0;

            if (leftDate !== rightDate) {
                return leftDate - rightDate;
            }

            return leftTask.id - rightTask.id;
        });

    const groupedTasks = Object.entries(
        selectedTasks.reduce<Record<string, Task[]>>((grouped, task) => {
            if (!task.task_date) {
                return grouped;
            }

            grouped[task.task_date] ??= [];
            grouped[task.task_date].push(task);

            return grouped;
        }, {}),
    ).sort(([leftDate], [rightDate]) => {
        const parsedLeft = parseDisplayDate(leftDate)?.getTime() ?? 0;
        const parsedRight = parseDisplayDate(rightDate)?.getTime() ?? 0;

        return parsedLeft - parsedRight;
    });

    const conflictingTasks = selectedTasks.filter((task) => {
        return task.report_id != null && task.report_id !== report.id;
    });

    const missingRequiredDates = selectedDates
        .filter((date) => {
            const formattedDate = format(date, 'MM/dd/yyyy');
            const hasTasks = selectedTasks.some(
                (task) => task.task_date === formattedDate,
            );

            return date.getDay() !== 0 && date.getDay() !== 6 && !hasTasks;
        })
        .map((date) => format(date, 'MM/dd/yyyy'));

    const isPeriodChanged = data.task_date !== initialValues.task_date;
    const hasChanges =
        isPeriodChanged || data.supervised_by !== initialValues.supervised_by;
    const isPeriodInvalid =
        conflictingTasks.length > 0 ||
        missingRequiredDates.length > 0 ||
        selectedTasks.length === 0;
    const supervisorOptions =
        data.supervised_by &&
        !supervisors.some(
            (supervisor) => String(supervisor.id) === data.supervised_by,
        )
            ? [
                  {
                      id: Number(data.supervised_by),
                      name: report.supervisor_name ?? 'Current supervisor',
                  },
                  ...supervisors,
              ]
            : supervisors;

    function resetDialog() {
        const nextDateRange = getInitialDateRange(report);

        setDateRange(nextDateRange);
        setData(getInitialReportValues(report, nextDateRange));
        clearErrors();
        setActiveAction(null);
    }

    function handleDateRangeChange(nextDateRange: DateRange | undefined) {
        setDateRange(nextDateRange);
        setData('task_date', serializeDateRange(nextDateRange));
    }

    return (
        <DialogLayout
            trigger={
                <Button type="button" variant="outline" size="sm">
                    Edit
                </Button>
            }
            title={report.report_code}
            description="Review, update, or delete the selected accomplishment report."
        >
            {({ close, resetRef }) => {
                resetRef.current = resetDialog;

                function handleDelete() {
                    if (
                        !window.confirm(
                            'Are you sure you want to delete this accomplishment report?',
                        )
                    ) {
                        return;
                    }

                    setActiveAction('delete');

                    destroy(
                        AccomplishmentReportController.destroy.url(report.id),
                        {
                            preserveScroll: true,
                            onSuccess: () => close(),
                            onFinish: () => setActiveAction(null),
                        },
                    );
                }

                function submitReport(event: SubmitEvent<HTMLFormElement>) {
                    event.preventDefault();
                    setActiveAction('save');

                    put(AccomplishmentReportController.update.url(report.id), {
                        preserveScroll: true,
                        onSuccess: () => close(),
                        onFinish: () => setActiveAction(null),
                    });
                }

                function handleGenerateFile(): void {
                    window.open(AccomplishmentReportController.generateReportFile.url(report.id), '_blank')
                }

                return (
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={submitReport}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`report-code-${report.id}`}>
                                    Report Code
                                </Label>
                                <Input
                                    id={`report-code-${report.id}`}
                                    value={report.report_code}
                                    readOnly
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`report-status-${report.id}`}>
                                    Status
                                </Label>
                                <Input
                                    id={`report-status-${report.id}`}
                                    value={report.status ?? 'N/A'}
                                    readOnly
                                />
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="grid gap-2">
                                <Label htmlFor={`report-author-${report.id}`}>
                                    Author
                                </Label>
                                <Input
                                    id={`report-author-${report.id}`}
                                    value={report.author ?? 'N/A'}
                                    readOnly
                                />
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`report-period-${report.id}`}>
                                    Report Period
                                </Label>
                                <DatePickerWithRange
                                    title=""
                                    date={dateRange}
                                    onChange={handleDateRangeChange}
                                />
                                <InputError message={errors.task_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor={`report-supervisor-${report.id}`}
                                >
                                    Supervisor
                                </Label>
                                <Select
                                    value={
                                        data.supervised_by ||
                                        UNASSIGNED_SUPERVISOR
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            'supervised_by',
                                            value === UNASSIGNED_SUPERVISOR
                                                ? ''
                                                : value,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id={`report-supervisor-${report.id}`}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a supervisor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value={UNASSIGNED_SUPERVISOR}
                                        >
                                            Unassigned
                                        </SelectItem>
                                        {supervisorOptions.map((supervisor) => (
                                            <SelectItem
                                                key={supervisor.id}
                                                value={String(supervisor.id)}
                                            >
                                                {supervisor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.supervised_by} />
                            </div>
                        </div>

                        {isPeriodChanged && conflictingTasks.length > 0 && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                Period changes are disabled because one or more
                                tasks in the selected range already belong to
                                another report.
                            </div>
                        )}

                        {isPeriodChanged && missingRequiredDates.length > 0 && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                Add tasks for these weekdays before changing the
                                period: {missingRequiredDates.join(', ')}.
                            </div>
                        )}

                        {isPeriodChanged &&
                            conflictingTasks.length === 0 &&
                            missingRequiredDates.length === 0 &&
                            selectedTasks.length === 0 && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                    No tasks were found for the selected period.
                                </div>
                            )}

                        <div className="grid gap-3">
                            <div className="flex items-center justify-between gap-2">
                                <Label>Tasks Grouped By Date</Label>
                                <span className="text-sm text-muted-foreground">
                                    {selectedTasks.length} task
                                    {selectedTasks.length === 1 ? '' : 's'}
                                </span>
                            </div>

                            {groupedTasks.length > 0 ? (
                                groupedTasks.map(([taskDate, tasksForDate]) => (
                                    <div
                                        key={`${report.id}-${taskDate}`}
                                        className="rounded-lg border p-4"
                                    >
                                        <p className="text-sm font-semibold">
                                            {taskDate}
                                        </p>
                                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                            {tasksForDate.map((task) => (
                                                <li key={task.id}>
                                                    {task.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    No tasks found for the selected report
                                    period.
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:justify-between">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGenerateFile}
                                >
                                    <Printer className="size-4" />
                                    Print to PDF
                                </Button>
                            </div>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
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
                                    disabled={
                                        processing ||
                                        !hasChanges ||
                                        !dateRange?.from ||
                                        !dateRange?.to ||
                                        (isPeriodChanged && isPeriodInvalid)
                                    }
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
