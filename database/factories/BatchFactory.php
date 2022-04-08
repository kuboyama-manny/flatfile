<?php

use Faker\Generator as Faker;
use Carbon\Carbon;

$factory->define(App\Models\Batch::class, function (Faker $faker) {
    $rows = $faker->biasedNumberBetween(10, 100);
    $columns = $faker->numberBetween(2, 25);
    $date = Carbon::instance($faker->dateTimeThisMonth());
    $mins = $faker->randomDigitNotNull;
    $memo = $faker->boolean(15);
    $submitted = $faker->boolean(80);
    $noCounts = $faker->boolean;
    $validated_in = Carbon::instance($faker->dateTimeThisMonth())->subMinutes($faker->numberBetween(0, 5))
                                                                 ->diffForHumans(null, true);
    $submitted_at = $date->copy()->addMinutes($mins);
    $handled_at = $submitted_at->copy()->addSeconds($faker->numberBetween(1, 90));
    $failed = $faker->boolean(5);
    $cols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $headers = collect($faker->words($columns))->unique()->map(function ($header, $index) use ($cols) {
        return ['index' => $index, 'letter' => $cols[$index], 'value' => $header];
    });
    $manual = $faker->boolean(50);
    $managed = $faker->boolean(90);

    $headersMatched = collect($headers)->filter(function ($word) use ($faker) {
        return $faker->boolean(95);
    })->map(function ($header) use ($faker) {
        $header['matched_key'] = $faker->word;
        return $header;
    });

    return [
        'filename' => $manual ? null : implode('-', $faker->words($faker->numberBetween(1, 4))).".csv",
        'original_file' => $manual ? null : implode('-', $faker->words($faker->numberBetween(1, 4))).".csv",
        'memo' => $memo ? $faker->sentence() : null,
        'managed' => $managed,
        'manual' => $manual,
        'count_rows' => $noCounts || $submitted ? $rows : null,
        'count_rows_invalid' => $noCounts || $submitted ? $faker->numberBetween(0, ceil($rows / 4)) : null,
        'count_rows_accepted' => $noCounts || $submitted ? $faker->numberBetween(ceil($rows * 0.95), $rows) : null,
        'count_columns' => $noCounts || $submitted ? $columns : null,
        'count_columns_matched' => !$manual && ($noCounts || $submitted)
            ? $faker->biasedNumberBetween(ceil($columns / 2), $columns)
            : null,
        'headers_raw' => $manual ? null : $headers->values(),
        'headers_matched' => $headersMatched->values(),
        'failure_reason' => $failed ? 'Error: ' . $faker->text($faker->numberBetween(50, 300)) : null,
        'validated_in' => $validated_in,
        'submitted_at' => $submitted ? $submitted_at : null,
        'created_at' => $date,
        'failed_at' => $submitted && $failed ? $handled_at : null,
        'handled_at' => $failed ? null : ($submitted ? $handled_at : null)
    ];
});
