<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use App\Http\Resources\API\LicenseCollection;
use App\Models\License;
use App\Models\Batch;
use App\Models\EndUser;
use Carbon\Carbon;
use Validator;

class LicenseController extends Controller
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

        $license = $team->licenses->first();

        if (!$license) {
            $license = License::create(['team_id' => $team->id, 'key' => Uuid::generate()->string]);
        }
        $collection = $team->licenses()
                           ->orderBy('created_at', 'desc')
                           ->paginate($request->page_size ?: 10);

        return new LicenseCollection($collection);
    }
}
