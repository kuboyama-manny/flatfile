<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use App\Models\Row;

class BatchRowImporter implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $rows;
    protected $batch_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($batch_id, $rows)
    {
        $this->batch_id = $batch_id;
        $this->rows = $rows;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach ($this->rows as $row) {
            Row::create([
                "batch_id" => $this->batch_id,
                "mapped" => $row["data"],
                "raw" => "",
                "valid" => $row["valid"],
                "sequence" => $row["sequence"]
            ]);
        }
    }
}
