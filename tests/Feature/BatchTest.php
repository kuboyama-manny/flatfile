<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Storage;

use App\Models\License;
use App\Models\Batch;
use App\Models\Row;
use App\Models\Team;
use App\User;

use App\Jobs\BatchRowImporter;

class BatchTest extends TestCase
{

    use WithFaker;
    use DatabaseTransactions;

    const BATCH_COUNT = 50;

    /**
     * Test creation of a Batch record, via the api.
     *
     * @return void
     */
    public function testPost()
    {
        $license = $this->__generateLicense();

        $response = $this->withHeaders([
            'License-Key' => $license->key,
        ])->json('POST', "/public-api/batches", [
            "filename" => "robots.csv",
            "headers_raw" => [
                [ "index" => 0, "value" => "name" ],
                [ "index" => 1, "value" => "color" ],
                [ "index" => 2, "value" => "nick" ],
                [ "index" => 3, "value" => "helmet" ],
            ],
            "headers_matched" => [
                [
                    "index" => 0, "value" => "name",
                    "matched_key" => "name",
                ], [
                    "index" => 1, "value" => "color",
                    "matched_key" => "shield-color",
                ], [
                    "index" => 2, "value" => "nick",
                    "matched_key" => "sign",
                ], [
                    "index" => 3, "value" => "helmet",
                    "matched_key" => "helmet-style",
                ]
            ],
            "count_rows" => 5,
            "count_columns" => 4,
            "count_columns_matched" => 4,
            "count_rows_accepted" => 4,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id', 'filename', 'manual', 'headers_raw', 'headers_matched',
            'count_rows', 'count_columns', 'count_columns_matched',
            'count_rows_invalid', 'count_rows_accepted', 'failure_reason',
            'submitted_at', 'failed_at', 'handled_at'
        ]);
    }

    /**
     * Testing creating of a batch and importing of rows.
     *
     * @return void
     */
    public function testImportRowsEnqueuesBatches()
    {
        $license = $this->__generateLicense();
        $batch = $this->__generateBatch($license, self::BATCH_COUNT * 3);
        $data = $this->__generateRows(self::BATCH_COUNT * 3);

        Queue::fake();
        $response = $this->__makeImportRowsRequest($license, $batch, $data);

        Queue::assertPushedTimes(BatchRowImporter::class, 3);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $batch->id,
        ]);
    }

    /**
     * Testing creating of a batch and importing of rows.
     *
     * @return void
     */
    public function testImportRowsPersistsToDatabase()
    {
        $license = $this->__generateLicense();
        $batch = $this->__generateBatch($license, self::BATCH_COUNT * 3);
        $data = $this->__generateRows(self::BATCH_COUNT * 3);

        $response = $this->__makeImportRowsRequest($license, $batch, $data);

        $this->assertEquals($batch->rows()->count(), self::BATCH_COUNT * 3);
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $batch->id,
        ]);
    }

    /**
     * Testing creating of a batch and importing of rows.
     *
     * @return void
     */
    public function testSuccessfulLinkingCsvFile()
    {
        $license = $this->__generateLicense();
        $batch = $this->__generateBatch($license, self::BATCH_COUNT * 3);

        $filename = "batch-uploads/{$batch->license->key}/{$batch->id}.csv";

        Storage::fake('s3');
        Storage::disk('s3')->put($filename, 'test');

        $response = $this->withHeaders([
            'License-Key' => $license->key,
        ])->json('POST', "/public-api/batches/{$batch->id}/link-csv");

        $this->assertDatabaseHas('uploads', ["path" => $filename]);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'id' => $batch->uploads()->first()->id
        ]);
    }

    /**
     * Testing creating of a batch and importing of rows.
     *
     * @return void
     */
    public function testFailedLinkingCsvFile()
    {
        $license = $this->__generateLicense();
        $batch = $this->__generateBatch($license, self::BATCH_COUNT * 3);

        $filename = "batch-uploads/{$batch->license->key}/{$batch->id}.csv";

        Storage::fake('s3');

        $response = $this->withHeaders([
            'License-Key' => $license->key,
        ])->json('POST', "/public-api/batches/{$batch->id}/link-csv");

        $this->assertDatabaseMissing('uploads', ["path" => $filename]);

        $response->assertStatus(500);
        $response->assertJsonFragment([
            'message' => 'file not uploaded',
        ]);
    }

    /**
     * test import-rows db transation
     *
     * @return void
     */
    public function testImportRowsDBTransaction()
    {
        $license = $this->__generateLicense();
        $batch = $this->__generateBatch($license, self::BATCH_COUNT);

        $importer = new BatchRowImporter($batch->id, $this->__generateRows(self::BATCH_COUNT));
        $importer->handle();

        $this->assertEquals($batch->rows()->count(), self::BATCH_COUNT);
    }

    protected function __generateBatch($license, $count)
    {
        $data = $this->__fakeBatchData($count);
        $data["license_id"] = $license->id;
        $data["team_id"] = $license->team_id;
        return factory(Batch::class)->create($data);
    }

    private function __makeImportRowsRequest($license, $batch, $data)
    {
        return $this->withHeaders([
            'License-Key' => $license->key,
        ])->json('POST', "/public-api/batches/{$batch->id}/import-rows", [
            'data' => $data
        ]);
    }

    private function __generateRows($count)
    {
        $out = [];
        for ($i=0; $i < $count; $i++) {
            $out[] = [
                "sequence" => $i,
                "valid" => true,
                "data" => $this->__generateRow()
            ];
        }
        return $out;
    }

    private function __generateRow()
    {
        return [
            "name" => $this->faker->name,
            "shield-color" => $this->faker->safeColorName,
            "sign" => $this->faker->userName,
            "helmet-style" => $this->faker->fileExtension
        ];
    }
}
