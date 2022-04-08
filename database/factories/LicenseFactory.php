<?php

use Faker\Generator as Faker;
use Webpatser\Uuid\Uuid;

$factory->define(App\Models\License::class, function (Faker $faker) {
    return [
        'key' => Uuid::generate()->string
    ];
});
