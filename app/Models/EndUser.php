<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\UuidGenerator;

class EndUser extends Model
{
    use UuidGenerator;

    public $incrementing = false;

    protected $fillable = [
        'name',
        'email',
        'user_id',
        'company_id',
        'company_name',
        'team_id'
    ];

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function teams()
    {
        return $this->belongsTo(Team::class);
    }
}
