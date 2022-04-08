<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use App\Http\Resources\API\BatchCollection;
use App\Http\Resources\API\BatchResource;
use App\Models\License;
use App\Models\Batch;
use App\Models\EndUser;
use Carbon\Carbon;
use Validator;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($request->team_id) {
            $team = $user->team()->where('id', $request->team_id)->first();
        } else {
            $team = $user->teams()->first();
        }

        return new BatchCollection($team->batches()
                                        ->orderBy('created_at', 'desc')
                                        ->paginate($request->page_size ?: 10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        $user = $request->user();
        $batch = Batch::find($id);
        $endUser = EndUser::find($batch->end_user_id);
        $batch['endUser'] = $endUser ? $endUser : null;
        $team = $user->teams()->where('id', $batch->team_id)->first();
        if (!$team) {
            // throw an error
        } else {
            return new BatchResource($batch);
        }
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
            'original_file' => 'string',
            'manual' => 'boolean',
            'managed' => 'boolean',
            'memo' => 'string',
            'count_rows' => 'integer',
            'count_rows_invalid' => 'integer',
            'count_rows_accepted' => 'integer',
            'count_columns' => 'integer',
            'count_columns_matched' => 'integer',
            'headers_raw' => 'array',
            'headers_matched' => 'array',
            'failure_reason' => 'string',
            'submitted_at' => 'date',
            'failed_at' => 'date',
            'handled_at' => 'date',
            'created_at' => 'date',
            'matched_at' => 'date',
            'validated_in' => 'string',
        ]);

        if (isset($data['created_at'])) {
            $data['created_at'] = Carbon::parse($data['created_at']);
        }

        if (isset($data['matched_at'])) {
            $data['matched_at'] = Carbon::parse($data['matched_at']);
        }

        if (isset($data['submitted_at'])) {
            $data['submitted_at'] = Carbon::parse($data['submitted_at']);
        }

        if (isset($data['failed_at'])) {
            $data['failed_at'] = Carbon::parse($data['failed_at']);
        }

        if (isset($data['handled_at'])) {
            $data['handled_at'] = Carbon::parse($data['handled_at']);
        }

        $batch = Batch::find($id);
        $batch->fill($data);
        $batch->save();

        return new BatchResource($batch);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
