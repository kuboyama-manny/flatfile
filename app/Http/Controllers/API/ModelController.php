<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\API\ModelCollection;
use App\Http\Resources\API\ModelResource;
use App\Http\Requests\API\StoreModelRequest;
use App\Http\Requests\API\UpdateModelRequest;
use App\Models\DataModel;
use Validator;

class ModelController extends Controller
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
            $team = $user->teams()->where('id', $request->team_id)->first();
        } else {
            $team = $user->teams()->first();
        }

        return new ModelCollection($team->models()->with('fields')->paginate($request->page_size ?: 10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $requests
     * @return \Illuminate\Http\Response
     */
    public function store(StoreModelRequest $request)
    {
        $data = $request->all();
        $user = $request->user();

        if (!$request->team_id) {
            $data['team_id'] = $user->primaryTeam()->id;
        }

        $model = DataModel::create($data);
        return new ModelResource($model->fresh());
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
        $model = DataModel::find($id);
        $team = $user->teams()->where('id', $model->team_id)->first();
        if (!$team) {
            // throw an error
        } else {
            $model->load('fields');
            return new ModelResource($model);
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
        $model = DataModel::find($id);
        $model->fill($request->all());
        $model->save();
        return new ModelResource($model->fresh());
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
