<?php

use Faker\Generator as Faker;

$factory->define(App\Models\Field::class, function (Faker $faker) {
    $name = $faker->words(2);
    return [
        'label' => ucwords(implode(' ', $name)),
        'key' => implode('_', $name)
    ];
});
