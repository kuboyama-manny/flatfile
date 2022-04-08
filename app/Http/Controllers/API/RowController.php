<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\API\RowCollection;
use App\Http\Resources\API\RowResource;
use App\Http\Requests\API\UpdateRowRequest;
use App\Models\Batch;
use App\Models\Row;

class RowController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
        ]);

        $user = $request->user();
        $batch = Batch::where('id', $request->batch_id)->first();
        $team = $user->teams()->where('id', $batch->team_id)->first();
        if (!$team) {
            // throw an error
        } else {
            return new RowCollection($batch->rows()->orderBy('sequence', 'asc')->get());
        }
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
        $row = Row::find($id);
        $team = $user->teams()->where('id', $row->batch->team_id)->first();
        if (!$team) {
            // throw an error
        } else {
            return new RowResource($row);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreModelRequest $request, $id)
    {

        $user = $request->user();
        $row = Row::find($id);
        $team = $user->teams()->where('id', $row->batch->team_id)->first();
        $row = Model::find($id);
        $row->fill($request->all());
        $row->save();
        return new RowResource($row);
    }
}
