<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\UseFactory;

use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['user_id', 'report_id', 'task_date', 'description'])]
class Task extends Model
{
    use HasFactory, SoftDeletes;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(AccomplishmentReport::class, 'report_id');
    }
}
