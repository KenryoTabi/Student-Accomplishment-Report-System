<?php

namespace App\Http\Controllers;

use App\Models\AccomplishmentReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccomplishmentReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('user-accomplishments', [
            'reports' => AccomplishmentReport::with(['user'])->get()->map(function (AccomplishmentReport $report) {
                return [
                    'id' => $report->id,
                    'description' => $report->description,
                    'status' => $report->status,
                    // 'user' => $report->user?->name,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AccomplishmentReport $accomplishmentReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccomplishmentReport $accomplishmentReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccomplishmentReport $accomplishmentReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccomplishmentReport $accomplishmentReport)
    {
        //
    }
}
