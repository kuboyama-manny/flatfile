<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;
use App\Models\License;
use App\Models\Batch;

class BatchController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $team = $user->teams()->first();
        $batches = $team->batches;
        return view('batches', ['batches' => $batches]);
    }
}
