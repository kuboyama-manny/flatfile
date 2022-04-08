<?php

namespace App\Http\Controllers\PublicApi;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PublicApi\Batch as BatchResource;
use App\Http\Resources\PublicApi\UploadResource;
use App\Models\License;
use App\Models\Batch;
use App\Models\Upload;
use App\Models\EndUser;
use App\Models\Row;
use Carbon\Carbon;
use Validator;
use Storage;
use App\Services\ExcelFile;

use App\Jobs\BatchRowImporter;

class BatchController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'filename' => 'string',
            'manual' => 'boolean',
            'count_rows' => 'integer',
            'imported_from_url' => 'string',
            'managed' => 'boolean',
            'created_at' => 'date',
            'header_hash' => 'string',
            'parsing_config' => 'array',
            'count_columns' => 'integer'
        ]);

        $license = $request->license;
        $batch = new Batch;
        if (isset($data['created_at'])) {
            $data['created_at'] = Carbon::parse($data['created_at']);
        }
        $batch->fill($data);
        $batch->filename = str_limit($data['filename'], 252);
        $batch->license_id = $license->id;
        $batch->team_id = $license->team_id;
        $batch->save();

        $res = response()->json(new BatchResource($batch));

        if (env('AWS_SECRET')) {
            $res->header('X-Signed-Upload-Url', $this->getSignedUrlForBatch($batch))
                ->header('Access-Control-Expose-Headers', ['X-Signed-Upload-Url']);
        }

        return $res;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'filename' => 'string',
            'manual' => 'boolean',
            'managed' => 'boolean',
            'original_file' => 'string',
            'memo' => 'string',
            'count_rows' => 'integer',
            'count_rows_invalid' => 'integer',
            'count_rows_accepted' => 'integer',
            'count_columns' => 'integer',
            'count_columns_matched' => 'integer',
            'imported_from_url' => 'string',
            'header_hash' => 'string',
            'headers_raw' => 'array',
            'headers_matched' => 'array',
            'parsing_config' => 'array',
            'failure_reason' => 'string',
            'matched_at' => 'date',
            'created_at' => 'date',
            'submitted_at' => 'date',
            'failed_at' => 'date',
            'handled_at' => 'date',
            'validated_in' => 'string',
        ]);

        $endUserData = $request['end_user'] ? $request->validate([
          'end_user.email' => 'string',
          'end_user.name' => 'string',
          'end_user.company_name' => 'string',
          'end_user.user_id' => 'string',
          'end_user.company_id' => 'string'
        ])['end_user'] : null;

        if (isset($data['submitted_at'])) {
            $data['submitted_at'] = Carbon::parse($data['submitted_at']);
        }

        if (isset($data['created_at'])) {
            $data['created_at'] = Carbon::parse($data['created_at']);
        }

        if (isset($data['matched_at'])) {
            $data['matched_at'] = Carbon::parse($data['matched_at']);
        }

        if (isset($data['failed_at'])) {
            $data['failed_at'] = Carbon::parse($data['failed_at']);
        }

        if (isset($data['handled_at'])) {
            $data['handled_at'] = Carbon::parse($data['handled_at']);
        }

        $end_user_uuid = null;

        if (!is_null($endUserData)) {
            $license = $request->license;
            $endUserData['team_id'] = $license->team_id;

            $endUser = EndUser::where('user_id', $endUserData['user_id'])->where('team_id', $endUserData['team_id'])
                                                                         ->first();
            if (!$endUser) {
                $endUser = new EndUser;
            }
            $data['end_user_id'] = $endUser->id;
            $endUser->fill($endUserData);
            $endUser->save();
            $end_user_uuid = $endUser->id;
        }

        $batch = Batch::find($id);
        $batch->fill($data);
        $batch->save();

        $batch['end_user_uuid'] = $end_user_uuid;

        return new BatchResource($batch);
    }

    /**
     * Link the CSV file that was uploaded
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function linkCSV(Request $request, Batch $batch)
    {
        $attachment = $request->attachment;

        $storedFilenameCsv = "batch-uploads/{$batch->license->key}/{$batch->id}.csv";

        if (Storage::disk('s3')->exists($storedFilenameCsv)) {
            $size = Storage::disk('s3')->size($storedFilenameCsv);

            $upload = $batch->uploads()->save(new Upload([
                'filename' => $batch->filename,
                'filesize' => $size,
                'filetype' => 'csv',
                'path' => $storedFilenameCsv,
                'license_id' => $batch->license->id,
            ]));
            return new UploadResource($upload);
        } else {
            return response()->json(["message" => "file not uploaded"], 500);
        }
    }

    /**
     * Store a XLS files in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function storeXLS(Request $request, $id)
    {
        $batch = Batch::find($id);

        $attachment = $request->attachment;

        $storedFilename = $batch->license->key.'/'.$batch->id.'.'.$attachment->getClientOriginalExtension();
        $storedFilenameCsv = $batch->license->key.'/'.$batch->id.'.csv';

        $savedXls = Storage::drive('s3')->putFileAs(
            'batch-uploads',
            $attachment,
            $storedFilename
        );

        $xlsUpload = $batch->uploads()->save(new Upload([
            'filename' => $attachment->getClientOriginalName(),
            'filesize' => $attachment->getSize(),
            'filetype' => $attachment->getClientOriginalExtension(),
            'path' => $savedXls,
            'license_id' => $batch->license->id,
        ]));

        $reader = new ExcelFile($attachment->getRealPath());

        $csvString = $reader->getCSVString();

        $savedCsv = Storage::drive('s3')->put("batch-uploads/$storedFilenameCsv", $csvString);

        $csvUpload = $batch->uploads()->save(new Upload([
            'filename' => str_replace(
                '.'.$attachment->getClientOriginalExtension(),
                '.csv',
                $attachment->getClientOriginalName()
            ),
            'filesize' => strlen($csvString),
            'filetype' => 'csv',
            'path' => "batch-uploads/$storedFilenameCsv",
            'license_id' => $batch->license->id,
        ]));

        return response()->json([
            "data" => [
                "csv" => new UploadResource($csvUpload),
                "original" => new UploadResource($xlsUpload)
            ]
        ], 200);
    }

    /**
     * Import Rows of data from Request Body
     *
     * @param Request $request
     * @param Batch $id
     * @return \Illuminate\Http\Response
     */
    public function importRows(Request $request, Batch $batch)
    {
        $data = collect($request->data);
        $p = 0;
        while (++$p) {
            $records = $data->forPage($p, 50);
            if ($records->isEmpty()) {
                break;
            }
            dispatch(new BatchRowImporter($batch->id, $records->toArray()));
        }

        // This would normally return the BatchResource with Rows...
        // However with the dispatched job entries; it shouldn't show new rows.
        // As the rows are saved asynchronously.
        return response()->json(new BatchResource($batch));
    }

    private function getSignedUrlForBatch($batch)
    {
        $adapter = Storage::disk('s3')->getDriver()->getAdapter();
        $client = $adapter->getClient();

        $command = $client->getCommand('PutObject', array_merge([
            'Bucket' => $adapter->getBucket(),
            'Key' => $adapter->getPathPrefix() . "batch-uploads/{$batch->license->key}/{$batch->id}.csv",
        ], []));

        $url = $client->createPresignedRequest(
            $command,
            now()->addMinutes(3)
        )->getUri();

        return $url;
    }
}
