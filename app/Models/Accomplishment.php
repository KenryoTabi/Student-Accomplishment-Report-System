<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'accomplishment_id', 'task_date', 'description'])]
class Accomplishment extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
