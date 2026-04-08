<?php

namespace App\Http\Controllers;

use App\Models\Intern;
use App\Models\Role;
use App\Models\User;
use App\Models\Section;
use Illuminate\Http\Request;

use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('users', [
            'users' => User::with(['role', 'section'])->get()->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role?->name,
                    'section' => $user->section?->code,
                ];
            }),
            'roles' => Role::select(['id', 'name'])->orderBy('name')->get(),
            'sections' => Section::select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('create-user');    
    //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $internRole = Role::find($request->role);
        // dd($request);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            'section_id' => 'required|exists:sections,id',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|min:8|confirmed',
        ];

        if ($internRole && $internRole->name === 'intern') {
            $rules = array_merge($rules, [
                'school' => 'required|string|max:255',
                'course' => 'required|string|max:255',
                'year_level' => 'required|string|max:50',
            ]);
        }

        $request->validate($rules);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'section_id' => $request->section_id,
            'phone' => $request->phone,
            'password' => bcrypt($request->password),
        ]);

        if ($internRole && $internRole->name === 'intern') {
            Intern::create([
                'user_id' => $user->id,
                'school' => $request->school,
                'course' => $request->course,
                'year_level' => $request->year_level,
            ]);
        }

        return redirect()->back()->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
