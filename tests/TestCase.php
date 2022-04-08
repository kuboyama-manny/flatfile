<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

use App\Models\License;
use App\Models\Team;
use App\Models\Batch;
use App\User;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function __generateLicense()
    {
        $user = factory(User::class)->create();
        $team = factory(Team::class)->create([
            "owner_id" => $user->id
        ]);
        return factory(License::class)->create([
          'team_id' => $team->id
        ]);
    }

    protected function __generateBatch($license, $count)
    {
        $data = $this->__fakeBatchData($count);
        $data["license_id"] = $license->id;
        $data["team_id"] = $license->team_id;
        return factory(Batch::class)->create($data);
    }

    protected function __fakeBatchData($count)
    {
        return [
            "headers_raw" => [
                [ "index" => 0, "value" => "name" ],
                [ "index" => 1, "value" => "color" ],
                [ "index" => 2, "value" => "nick" ],
                [ "index" => 3, "value" => "helmet" ],
            ],
            "headers_matched" => [
                [
                    "index" => 0,
                    "value" => "name",
                    "matched_key" => "name",
                ], [
                    "index" => 1,
                    "value" => "color",
                    "matched_key" => "shield-color",
                ], [
                    "index" => 2,
                    "value" => "nick",
                    "matched_key" => "sign",
                ], [
                    "index" => 3,
                    "value" => "helmet",
                    "matched_key" => "helmet-style",
                ]
            ],
            "count_rows" => $count,
            "count_columns" => 4,
            "count_columns_matched" => 4,
            "count_rows_accepted" => 4,
        ];
    }
}
