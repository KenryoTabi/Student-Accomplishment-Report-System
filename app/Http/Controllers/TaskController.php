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

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        switch ($user->role_id) {
            case 1: 
                $accomplishments = Task::with(['user'])->get();
                break;

            case 2:
                $accomplishments = Task::whereHas('user', function ($query) use ($user) {
                    $query->where('section_id', $user->section_id);
                })->with(['user'])->get();
                break;

            case 3:
                $accomplishments = Task::where('user_id', $user->id)->with(['user'])->get();
                break;

            default:
                $accomplishments = collect(); // Empty collection for unknown roles
        }
        return Inertia::render('user-tasks', [
            'accomplishments' => $accomplishments->map(function (Task $accomplishment) {
                return [
                    'id' => $accomplishment->id,
                    'description' => $accomplishment->description,
                    'status' => $accomplishment->status,
                    // 'user' => $accomplishment->user?->name,
                ];
            }),
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
        // dd($request->accomplishments);
        $accomplishments = $request->input('accomplishments', []);
        
        foreach ($accomplishments as $date => $description) {
            $date = Carbon::createFromFormat('m/d/Y', $date);
            $formatted = $date->format('Y-m-d');
            // dd($formatted);
            Task::create([
                'user_id' => Auth::id(),
                'task_date' => $formatted,
                'description' => $description,
            ]);
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $accomplishment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $accomplishment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $accomplishment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $accomplishment)
    {
        //
    }
}
