<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\Intern;
use App\Models\Role;
use App\Models\User;
use App\Models\Section;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use Inertia\Inertia;
use App\Constants\AppConstants;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Support\Constants;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $taskQuery = Task::query()
            ->with(['user'])
            ->orderByDesc('updated_at')
            ->orderByDesc('id');

        switch ($user->role_id) {
            case AppConstants::USER_ROLE_ADMIN: 
                break;

            case AppConstants::USER_ROLE_SUPERVISOR:
                $taskQuery->whereHas('user', function ($query) use ($user) {
                    $query->where('id', $user->id);
                });
                break;

            case AppConstants::USER_ROLE_STUDENT:
                $taskQuery->where('user_id', $user->id);
                break;

            default:
                $tasks = collect(); // Empty collection for unknown roles
        }

        $tasks = $taskQuery->paginate(10)->withQueryString();

        return Inertia::render('user-tasks', [
            'tasks' => $tasks->through(function (Task $accomplishment) {
                return [
                    'id' => $accomplishment->id,
                    'user' => $accomplishment->user?->name,
                    'task_date' => $accomplishment->task_date
                        ? Carbon::parse($accomplishment->task_date)->format('m/d/Y')
                        : null,
                    'description' => $accomplishment->description,
                    'status' => $accomplishment->status,
                ];
            })
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_date' => 'required|date_format:m/d/Y',
            'tasks' => 'required|array|min:1',
            'tasks.*' => 'required|string|max:255',
        ]);

        $formattedDate = Carbon::createFromFormat('m/d/Y', $validated['task_date'])
            ->format('Y-m-d');

        foreach ($validated['tasks'] as $description) {
            Task::create([
                'user_id' => Auth::id(),
                'task_date' => $formattedDate,
                'description' => $description,
            ]);
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $user_task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $user_task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $user_task)
    {
        $this->authorizeTaskAccess($user_task);

        $validated = $request->validate([
            'task_date' => 'required|date_format:m/d/Y',
            'description' => 'required|string|max:255',
        ]);

        $user_task->update([
            'task_date' => Carbon::createFromFormat('m/d/Y', $validated['task_date'])
                ->format('Y-m-d'),
            'description' => $validated['description'],
        ]);

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $user_task)
    {
        $this->authorizeTaskAccess($user_task);

        $user_task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }

    protected function authorizeTaskAccess(Task $user_task): void
    {
        $user = Auth::user();

        $canAccessTask = $user->role_id === AppConstants::USER_ROLE_ADMIN
            || $user->id === $user_task->user_id;

        abort_unless($canAccessTask, 403);
    }
}
