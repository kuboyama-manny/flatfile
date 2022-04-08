<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\License;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Services\ExcelFile;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ExcelTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUploadingExcelFileReturnsCsv()
    {
        $testFile = base_path(). "/tests/Stubs/robots.xlsx";
        $targetFile = base_path(). "/tests/Stubs/robots.csv";

        $license = $this->__generateLicense();
        $batch = $this->__generateBatch($license, 10);

        $response = $this->withHeaders([
            "license-key" => $license->key
        ]);

        $path = "batch-uploads/{$batch->license->key}/{$batch->id}";

        Storage::fake('s3');

        $response=$this->json("POST", "/public-api/batches/{$batch->id}/transform-xls", [
            "attachment" => new UploadedFile(
                $testFile,
                "robots.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                filesize($testFile)
            ),
        ]);

        $this->assertDatabaseHas('uploads', ["path" => "$path.csv"]);
        $this->assertDatabaseHas('uploads', ["path" => "$path.xlsx"]);

        Storage::disk('s3')->assertExists("$path.csv");
        Storage::disk('s3')->assertExists("$path.xlsx");

        $response->assertStatus(200);

        $response->assertJsonFragment([
            'filename' => "robots.csv"
        ]);
        $response->assertJsonFragment([
            'filename' => "robots.xlsx"
        ]);

    }
}
