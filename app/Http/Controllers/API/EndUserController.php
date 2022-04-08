<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use App\Http\Resources\API\EndUserCollection;
use App\Http\Resources\API\EndUserResource;
use App\Models\License;
use App\Models\EndUser;
use App\Models\Batch;
use App\Models\Team;
use Carbon\Carbon;
use Validator;

class EndUserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'string',
            'email' => 'string',
            'user_id' => 'string',
            'company_id' => 'string',
            'company_name' => 'string',
        ]);

        $endUser = new EndUser;
        $endUser->fill($data);
        $endUser->save();

        return response()->json(new EndUserResource($endUser))->header('Access-Control-Allow-Origin', '*');
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
        $endUser = EndUser::find($id);

        if (!$endUser) {
            // return not found error
            return false;
        }

        if (!$user->teams()->find($endUser->team_id)) {
            // raise exception, user does not belong to any of my teams
            return false;
        }
        // return new EndUserResource($endUser);
        return new EndUserResource($endUser);
        // return response()->json(new EndUserResource($endUser));
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
            'name' => 'string',
            'email' => 'string',
            'user_id' => 'string',
            'company_id' => 'string',
            'company_name' => 'string',
        ]);

        $endUser = EndUser::find($id);
        $endUser->fill($data);
        $endUser->save();

        return response()->json(new EndUserResource($endUser))->header('Access-Control-Allow-Origin', '*');
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
