<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\Models\EndUser::class, function (Faker $faker) {
    $hasCompany = $faker->boolean(70);
    return [
        'user_id' => $faker->ean8,
        'name' =>  $faker->boolean(95) ? $faker->name : null,
        'email' => $faker->boolean(95) ? $faker->unique()->safeEmail : null,
        'company_name' => $hasCompany ? $faker->company : null,
        'company_id' => $hasCompany && $faker->boolean(90) ? $faker->ean8 : null
    ];
});
