<?php

use Faker\Generator as Faker;

$factory->define(App\Models\DataModel::class, function (Faker $faker) {
    $name = $faker->word;
    return [
        'name' => ucwords($name),
        'type' => $name
    ];
});
