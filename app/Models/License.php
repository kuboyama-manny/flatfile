<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Webpatser\Uuid\Uuid;
use App\Traits\UuidGenerator;
use Jaspaul\LaravelRollout\Contracts\User as RolloutContract;

class License extends Model implements RolloutContract
{
    use UuidGenerator;

    protected $uuidKey = 'key';
    protected $fillable = [
        'name', 'domains', 'team_id', 'created_by', 'key'
    ];

    /**
     * The identifier to use with rollout.
     *
     * @return string
     *         The id.
     */
    public function getRolloutIdentifier()
    {
        return "license:{$this->id}";
    }

    public function uploads()
    {
        return $this->hasMany(Upload::class);
    }

    public function getFeatures()
    {
        return features_list()->mapWithKeys(function ($feature) {
            return [$feature => feature_active($feature, $this)];
        });
    }
}
