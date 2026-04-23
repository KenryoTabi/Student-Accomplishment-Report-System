<?php

namespace App\Http\Controllers;

use App\Constants\AppConstants;
use App\Models\AccomplishmentReport;
use App\Models\Intern;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use TCPDF;

class AccomplishmentReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $user = Auth::user();

        $reportQuery = AccomplishmentReport::query()
            ->with(['user', 'supervisor'])
            ->orderByDesc('start_date')
            ->orderByDesc('created_at');

        $taskQuery = Task::query()
            ->with(['user'])
            ->orderByDesc('task_date')
            ->orderByDesc('created_at');

        switch ($user->role_id) {
            case AppConstants::USER_ROLE_ADMIN:
                $reportQuery->get();
                $taskQuery->get();
                break;

            case AppConstants::USER_ROLE_SUPERVISOR:
            case AppConstants::USER_ROLE_STUDENT:
                $reportQuery
                    ->where('user_id', $user->id)
                    ->get();
                $taskQuery
                    ->where('user_id', $user->id)
                    ->get();
                break;

            default:
                $reports = collect();
                $tasks = collect();
        }

        $tasks = $taskQuery->get();
        $reports = $reportQuery->paginate(10)->withQueryString();

        return Inertia::render('user-accomplishments', [
            'reports' => $reports->through(function (AccomplishmentReport $report) {
                $startDate = $report->start_date
                    ? Carbon::parse($report->start_date)->format('m/d/Y')
                    : null;
                $endDate = $report->end_date
                    ? Carbon::parse($report->end_date)->format('m/d/Y')
                    : null;

                return [
                    'id' => $report->id,
                    'report_code' => $report->report_code,
                    'user_id' => $report->user_id,
                    'author' => $report->user?->name,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'period' => $startDate && $endDate
                        ? "{$startDate} - {$endDate}"
                        : null,
                    'status' => Str::title($report->status),
                    'supervisor_id' => $report->supervised_by,
                    'supervisor_name' => $report->supervisor?->name,
                ];
            }),
            'tasks' => $tasks->map(function (Task $task) {
                return [
                    'id' => $task->id,
                    'user_id' => $task->user_id,
                    'report_id' => $task->report_id,
                    'user' => $task->user?->name,
                    'description' => $task->description,
                    'task_date' => $task->task_date
                        ? Carbon::parse($task->task_date)->format('m/d/Y')
                        : null,
                ];
            })->values(),
            'supervisors' => User::query()
                ->where('role_id', AppConstants::USER_ROLE_SUPERVISOR)
                ->orderBy('name')
                ->get()
                ->map(function (User $supervisor) {
                    return [
                        'id' => $supervisor->id,
                        'name' => $supervisor->name,
                    ];
                })
                ->values(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        $validated = $request->validate([
            'task_date' => 'required|string',
            'accomplishments' => 'required|array|min:1',
            'accomplishments.*' => 'nullable|string',
        ], [
            'task_date.required' => 'Please select a date range.',
            'accomplishments.required' => 'No accomplishments were generated for the selected range.',
        ]);

        $sortedDates = $this->parseSelectedDates($validated['task_date']);
        $reportData = $this->prepareReportData(Auth::id(), $sortedDates);

        $existingReport = AccomplishmentReport::query()
            ->where('user_id', Auth::id())
            ->whereDate('start_date', $reportData['start_date'])
            ->whereDate('end_date', $reportData['end_date'])
            ->exists();

        if ($existingReport) {
            $reportData['errors']['task_date'] =
                'You already generated an accomplishment report for this date range.';
        }

        if ($reportData['errors'] !== []) {
            throw ValidationException::withMessages($reportData['errors']);
        }

        DB::transaction(function () use ($reportData): void {
            $report = new AccomplishmentReport;
            $report->report_code = $this->generateReportCode();
            $report->user_id = Auth::id();
            $report->start_date = $reportData['start_date'];
            $report->end_date = $reportData['end_date'];
            $report->supervised_by = $this->resolveDefaultSupervisorId(Auth::id());
            $report->save();

            Task::query()
                ->whereIn('id', $reportData['tasks']->pluck('id'))
                ->update([
                    'report_id' => $report->id,
                ]);
        });

        return redirect()->back()->with('success', 'Accomplishment report generated successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AccomplishmentReport $accomplishmentReport) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccomplishmentReport $accomplishmentReport) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccomplishmentReport $accomplishmentReport) {
        $this->authorizeReportAccess($accomplishmentReport);

        $validated = $request->validate([
            'task_date' => 'required|string',
            'supervised_by' => [
                'nullable',
                Rule::exists('users', 'id')->where(
                    fn ($query) => $query->where('role_id', AppConstants::USER_ROLE_SUPERVISOR),
                ),
            ],
        ], [
            'task_date.required' => 'Please select a date range.',
            'supervised_by.exists' => 'Please select a valid supervisor.',
        ]);

        $sortedDates = $this->parseSelectedDates($validated['task_date']);
        $reportData = $this->prepareReportData(
            $accomplishmentReport->user_id,
            $sortedDates,
            $accomplishmentReport,
        );

        $existingReport = AccomplishmentReport::query()
            ->where('user_id', $accomplishmentReport->user_id)
            ->whereDate('start_date', $reportData['start_date'])
            ->whereDate('end_date', $reportData['end_date'])
            ->where('id', '!=', $accomplishmentReport->id)
            ->exists();

        if ($existingReport) {
            $reportData['errors']['task_date'] =
                'An accomplishment report already exists for this user and date range.';
        }

        if ($reportData['errors'] !== []) {
            throw ValidationException::withMessages($reportData['errors']);
        }

        DB::transaction(function () use (
            $accomplishmentReport,
            $reportData,
            $validated,
        ): void {
            Task::query()
                ->where('report_id', $accomplishmentReport->id)
                ->update([
                    'report_id' => null,
                ]);

            Task::query()
                ->whereIn('id', $reportData['tasks']->pluck('id'))
                ->update([
                    'report_id' => $accomplishmentReport->id,
                ]);

            $accomplishmentReport->start_date = $reportData['start_date'];
            $accomplishmentReport->end_date = $reportData['end_date'];
            $accomplishmentReport->supervised_by = $validated['supervised_by'] ?? null;
            $accomplishmentReport->save();
        });

        return redirect()->back()->with('success', 'Accomplishment report updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccomplishmentReport $accomplishmentReport) {
        $this->authorizeReportAccess($accomplishmentReport);

        DB::transaction(function () use ($accomplishmentReport): void {
            Task::query()
                ->where('report_id', $accomplishmentReport->id)
                ->update([
                    'report_id' => null,
                ]);

            $accomplishmentReport->forceDelete();
        });

        return redirect()->back()->with('success', 'Accomplishment report deleted successfully.');
    }

    protected function authorizeReportAccess(AccomplishmentReport $accomplishmentReport): void{
        $user = Auth::user();

        $canAccessReport = $user->role_id === AppConstants::USER_ROLE_ADMIN
            || $user->id === $accomplishmentReport->user_id;

        abort_unless($canAccessReport, 403);
    }

    protected function parseSelectedDates(string $taskDate): Collection {
        $selectedDates = collect(explode(',', $taskDate))
            ->map(fn (string $date) => trim($date))
            ->filter()
            ->unique()
            ->values();

        if ($selectedDates->isEmpty()) {
            throw ValidationException::withMessages([
                'task_date' => 'Please select a valid date range.',
            ]);
        }

        $parsedDates = $selectedDates->map(function (string $date) {
            try {
                return Carbon::createFromFormat('m/d/Y', $date)->startOfDay();
            } catch (\Throwable) {
                return null;
            }
        });

        if ($parsedDates->contains(null)) {
            throw ValidationException::withMessages([
                'task_date' => 'The selected date range contains an invalid date.',
            ]);
        }

        return $parsedDates
            ->sortBy(fn (Carbon $date) => $date->timestamp)
            ->values();
    }

    protected function prepareReportData( int $userId, Collection $sortedDates, AccomplishmentReport $accomplishmentReport = null, ): array {
        $startDate = $sortedDates->first()->copy()->format('Y-m-d');
        $endDate = $sortedDates->last()->copy()->format('Y-m-d');
        $selectedDateValues = $sortedDates
            ->map(fn (Carbon $date) => $date->format('Y-m-d'))
            ->all();

        $tasks = Task::query()
            ->where('user_id', $userId)
            ->whereIn('task_date', $selectedDateValues)
            ->orderBy('task_date')
            ->orderBy('created_at')
            ->get();

        $errors = $this->validateReportTasks($sortedDates, $tasks);

        $conflictingTasks = $tasks->filter(function (Task $task) use ($accomplishmentReport) {
            return $task->report_id !== null
                && $task->report_id !== $accomplishmentReport?->id;
        });

        if ($conflictingTasks->isNotEmpty()) {
            $errors['task_date'] =
                'One or more tasks in the selected date range already belong to another accomplishment report.';
        }

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'tasks' => $tasks,
            'errors' => $errors,
        ];
    }

    protected function validateReportTasks(Collection $sortedDates, Collection $tasks): array {
        $tasksByDate = $tasks->groupBy(function (Task $task) {
            return Carbon::parse($task->task_date)->format('m/d/Y');
        });

        $errors = [];

        foreach ($sortedDates as $date) {
            if ($date->isWeekend()) {
                continue;
            }

            $formattedDate = $date->format('m/d/Y');

            if (! $tasksByDate->has($formattedDate)) {
                $errors["accomplishments.{$formattedDate}"] =
                    "A weekday accomplishment is required for {$formattedDate}. Add a task first.";
            }
        }

        if ($tasks->isEmpty()) {
            $errors['task_date'] = 'No tasks were found for the selected date range.';
            $errors['accomplishments'] = 'No tasks were found for the selected date range.';
        } elseif (
            collect(array_keys($errors))
                ->contains(fn (string $key) => str_starts_with($key, 'accomplishments.'))
        ) {
            $errors['task_date'] =
                'Add tasks for every weekday in the selected date range before saving the report.';
        }

        return $errors;
    }

    protected function resolveDefaultSupervisorId(int $userId): ?int {
        return Intern::query()
            ->where('user_id', $userId)
            ->value('supervisor_id');
    }

    protected function generateReportCode(): string {
        do {
            $reportCode = 'AR-'.now()->format('YmdHis').'-'.Str::upper(Str::random(6));
        } while (
            AccomplishmentReport::query()
                ->where('report_code', $reportCode)
                ->exists()
        );

        return $reportCode;
    }

    public function generateReportFile(int $reportId): string {
        $user = Auth::user();

        $report = AccomplishmentReport::query()
            ->with(['user', 'supervisor'])
            ->where('id', $reportId)
            ->firstOrFail();

        $this->authorizeReportAccess($report);
        $owner = $report->user;

        $intern = Intern::query()
            ->with(['user'])
            ->where('user_id', $owner->id)
            ->first();

        $tasks = Task::query()
            ->with(['user'])
            ->where('report_id', $reportId)
            ->orderBy('task_date')
            ->get()
            ->groupBy('task_date');

        
        
        $pdf = new AccomplishmentPDF(    
            'P',
            'mm',     
            'A4',
            true,
            'UTF-8',
            false
        );

        $pdf->SetCreator('Laravel App');
        $pdf->SetAuthor('System');
        $pdf->SetTitle('User Report');
        
        $pdf->setUser([
            'name' => $owner->name,
            'course' => $intern?->course,
            'school' => $intern?->school,
            ]);

        $pdf->setAccomplishmentPeriod(
            Carbon::parse($report->start_date)->format('m/d/Y') . ' - ' .
            Carbon::parse($report->end_date)->format('m/d/Y')
        );
        

        $pdf->setSignatories([
                'name' => $owner->name,
                'title' => ($owner->role_id == AppConstants::USER_ROLE_STUDENT) ? "OJT Student’s Signature" : "Employee Signature"
            ],
            [
                'name' => $report->supervisor?->name,
                'title' => 'Field Supervisor’s Name & Signature'
            ]
        );

        $pdf->setPrintHeader(true);
        $pdf->setPrintFooter(true);

        $pdf->SetMargins(25.4, 70, 25.4);
        $pdf->SetHeaderMargin(10);
        $pdf->setAutoPageBreak(true, 60);

        $html = "<table border=\"1\" cellpadding=\"5\">
            <thead>
                <tr>
                    <th width=\"30%\" align=\"center\"><b>Date</b></th>
                    <th width=\"70%\" align=\"center\"><b>Accomplishments</b></th>
                </tr>
            </thead>
            <tbody>";
        foreach ($tasks as $date => $tasksForDate) {
            $formattedDate = Carbon::parse($date)->format('m/d/Y');
            $html .= "<tr nobr=\"true\">
                <td width=\"30%\" align=\"center\">{$formattedDate}</td>
                <td width=\"70%\" align=\"left\">
                <ul style=\"margin: 0; padding-left: 20px;\">";

            foreach ($tasksForDate as $task) {
                $html .= "<li style=\"margin-bottom: 5px;\">{$task->description}</li>";
            }
            $html .= "</ul></td></tr>";
        }
        $html .= "</tbody></table>";

        $pdf->AddPage();
        $pdf->writeHTML($html);   

        return response($pdf->Output('report.pdf', 'D'), 200)
            ->header('Content-Type', 'application/pdf');
    }
}


class AccomplishmentPDF extends TCPDF{
    private $user;
    private $accomplishmentPeriod;
    
    private $leftSignatory;
    private $rightSignatory;
    
    public function setUser($user) {
        $this->user = $user;
    }

    public function setSignatories($left, $right) {
        $this->leftSignatory = $left;
        $this->rightSignatory = $right;
    }

    public function setAccomplishmentPeriod($period) {
        $this->accomplishmentPeriod = $period;
    }

    // HEADER
    public function Header() {

        $dswdHeader = public_path('storage/images/dswd-header.png');
        $titleLable = $this->user['school'] ? 'STUDENT TRAINING PROGRAM' : '';
        $documentTitle = $this->user['school']? 'Detailed Weekly Accomplishment Report' : 'Accomplishment Report';
        $this->Image($dswdHeader, 15.4, 3.9, 60);

        $this->setY(25);

        // Title
        $this->SetFont('helvetica', 'BU', 14);
        $this->Cell(0, 6, $titleLable, 0, 1, 'C');

        // Document Title
        $this->SetFont('helvetica', 'BU', 12);
        $this->Cell(0, 6, $documentTitle, 0, 1, 'C');

        // Date
        $this->SetFont('helvetica', '', 10);
        $this->Cell(0, 6, 'Period: ' . $this->accomplishmentPeriod, 0, 1, 'C');

        $this->Ln(5);

        // User details (left aligned)
        $this->SetFont('helvetica', '', 10);

        $this->Cell(0, 5, 'NAME: ' . ($this->user['name'] ?? ''), 0, 1, 'L');
        $this->Cell(0, 5, 'SCHOOL: ' . ($this->user['school'] ?? ''), 0, 1, 'L');
        $this->Cell(0, 5, 'COURSE: ' . ($this->user['course'] ?? ''), 0, 1, 'L');
    }

    public function Footer() {
        $this->setY(-60);
        $this->SetFont('helvetica', 'B', 10);
        $this->Cell(80, 5, 'Prepared By:', '', 0, 'L');

        $this->SetX(110);
        $this->Cell(80, 5, 'Supervised By:', '', 0, 'L');
        $this->Ln(20);
        
        $this->SetFont('helvetica', 'B', 10);
        $this->SetX(20);
        $this->Cell(60, 5, strtoupper($this->leftSignatory['name']) ?? '', 'B', 0, 'C');

        $this->SetX(130);
        $this->Cell(60, 5, strtoupper($this->rightSignatory['name']) ?? '', 'B', 0, 'C');
        $this->Ln(5);
        
        $this->SetFont('helvetica', '', 10);

        $this->SetX(20);
        $this->Cell(60, 5, $this->leftSignatory['title'] ?? '', 0, 0, 'C');

        $this->SetX(130);
        $this->Cell(60, 5, $this->rightSignatory['title'] ?? '', 0, 0, 'C');      
    }
}