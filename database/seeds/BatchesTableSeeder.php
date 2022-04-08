<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;
use App\Models\Team;
use App\Models\Batch;
use App\Models\EndUser;
use App\Models\Row;
use App\Models\Upload;
use League\Csv\Writer;

class BatchesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Faker $faker)
    {
        DB::statement('TRUNCATE rows RESTART IDENTITY CASCADE');
        DB::statement('TRUNCATE batches RESTART IDENTITY CASCADE');

        $team = Team::first();
        $license = $team->licenses()->first();
        $endUsers = factory(EndUser::class, 10)->create([
            'team_id' => $team->id,
        ]);

        factory(Batch::class, 50)->create([
          'team_id' => $team->id,
          'license_id' => $license->id
        ])->each(function ($batch) use ($faker, $endUsers) {
            if ($faker->boolean(90)) {
                $batch->end_user_id = $endUsers->random()->id;
                $batch->save();
            }
            $headers = collect($batch->headers_matched);
            $headersRaw = collect($batch->headers_raw);

            if ($headers->count() && $headersRaw->count() === 0) {
                $headersRaw = $headers;
            }

            $matchedKeys = $headers->mapWithKeys(function ($header) {
                return [$header['value'] => $header['matched_key']];
            });

            $invalid = 0;
            if (!$batch->manual && $batch->managed) {
                $csv = Writer::createFromString('');
                $csv->insertOne($headersRaw->map(function ($header) {
                    return $header['value'];
                })->toArray());
            }
            $indexes = $headersRaw->map(function ($header) use ($faker) {
                $possible = collect([0,1,2,3,4,5]);
                return $possible->random();
            });
            for ($i=0; $i < $batch->count_rows; $i++) {
                $raw = $headersRaw->mapWithKeys(function ($header, $i) use ($faker, $indexes) {
                    $possible = [
                        $faker->boolean(5),
                        $faker->randomDigitNotNull,
                        $faker->email,
                        $faker->text($faker->numberBetween(10, 30)),
                        $faker->numberBetween(10, 10000),
                        $faker->name
                    ];
                    return [$header["value"] => $possible[$indexes[$i]]];
                });

                $valid = $i < $batch->count_rows_accepted + $invalid;

                if (!$batch->manual && $batch->managed) {
                    $csv->insertOne($raw->values()->toArray());
                }

                $matched = $raw->filter(function ($value, $header) use ($matchedKeys) {
                    return isset($matchedKeys[$header]);
                })->mapWithKeys(function ($value, $header) use ($matchedKeys) {
                    return [$matchedKeys[$header] => $value];
                });

                if ($faker->boolean(2) && $invalid < $batch->count_rows_invalid) {
                    $invalid++;
                    $valid = false;
                }
                if ($batch->managed && $batch->submitted_at) {
                    Row::create([
                        'raw' => $raw->values()->map(function ($value) {
                            return implode('', ['"', $value, '"']);
                        })->implode(','),
                        'sequence' => $i + 1,
                        'mapped' => $matched,
                        'batch_id' => $batch->id,
                        'valid' => $valid
                    ]);
                }
            }
            if (!$batch->manual && $batch->managed) {
                $csvString = $csv->getContent();
                $path = Storage::drive('public')->put(
                    "batch-uploads/{$batch->license->key}/{$batch->id}.csv",
                    $csvString
                );
                Upload::create([
                    'batch_id' => $batch->id,
                    'path' => "batch-uploads/{$batch->license->key}/{$batch->id}.csv",
                    'license_id' => $batch->license->id,
                    'filename' => $batch->filename,
                    'filesize' => strlen($csvString),
                    'filetype' => 'csv',
                    'drive' => 'public'
                ]);
            }
        });

    }
}
