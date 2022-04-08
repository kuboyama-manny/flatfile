<?php

namespace App\Models;

use Laravel\Spark\Team as SparkTeam;

class Team extends SparkTeam
{
    public function licenses()
    {
        return $this->hasMany(License::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function endUsers()
    {
        return $this->hasMany(EndUser::class);
    }

    public function models()
    {
        return $this->hasMany(DataModel::class);
    }
}
