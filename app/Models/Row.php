<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidGenerator;

class Row extends Model
{
    use UuidGenerator;

    public $incrementing = false;

    protected $casts = [
        'mapped' => 'array',
        'raw' => 'array'
    ];

    protected $dates = [
        'created_at', 'updated_at'
    ];

    protected $fillable = [
        'batch_id',
        'mapped',
        'raw',
        'valid',
        'sequence',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
