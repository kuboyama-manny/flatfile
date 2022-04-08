<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidGenerator;
use Carbon\Carbon;

class Batch extends Model
{
    use UuidGenerator;

    protected $dates = ['created_at', 'updated_at', 'matched_at', 'submitted_at', 'failed_at', 'handled_at'];

    protected $casts = [
        'headers_raw' => 'array',
        'headers_matched' => 'array',
        'parsing_config' => 'array'
    ];

    protected $fillable = [
        'filename',
        'end_user_id',
        'original_file',
        'manual',
        'managed',
        'memo',
        'count_rows',
        'count_rows_invalid',
        'count_rows_accepted',
        'count_columns',
        'count_columns_matched',
        'headers_raw',
        'headers_matched',
        'parsing_config',
        'imported_from_url',
        'header_hash',
        'failure_reason',
        'submitted_at',
        'failed_at',
        'created_at',
        'matched_at',
        'handled_at',
        'validated_in',
    ];

    public $incrementing = false;

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function endUser()
    {
        return $this->belongsTo(EndUser::class);
    }

    public function rows()
    {
        return $this->hasMany(Row::class);
    }

    public function uploads()
    {
        return $this->hasMany(Upload::class);
    }

    public function license()
    {
        return $this->belongsTo(License::class);
    }

    public function getStatusAttribute()
    {
        if ($this->failed_at) {
            return 'failed';
        }
        if ($this->handled_at) {
            return 'completed';
        }
        if ($this->submitted_at) {
            return 'submitted';
        }
        if ($this->matched_at && $this->matched_at->diffInMinutes(Carbon::now()) > 30) {
            return 'abandoned';
        }
        if ($this->matched_at) {
            return 'matched';
        }
        if ($this->created_at && $this->created_at->diffInMinutes(Carbon::now()) > 30) {
            return 'abandoned';
        }
        return 'started';
    }

    public function getMatchingTimeAttribute()
    {
        if ($this->submitted_at) {
            return $this->created_at->diffForHumans($this->submitted_at, true);
        }
        return null;
    }

    public function getProcessingTimeAttribute()
    {
        if ($this->submitted_at) {
            return $this->submitted_at->diffForHumans($this->handled_at ?: $this->failed_at, true);
        }
        return null;
    }
}
