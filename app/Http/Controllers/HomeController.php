<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;
use App\Models\License;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');

        // $this->middleware('subscribed');
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $teams = $user->teams;
        $items = $teams->map(function ($team) {
            $license = $team->licenses->first();

            if (!$license) {
                $license = License::create(['team_id' => $team->id, 'key' => Uuid::generate()->string]);
            }
            return ['team' => $team, 'license' => $license];
        });
        return view('home', ['items' => $items]);
    }

    /**
     * Show the dashboard page
     *
     * @return Response
     */
    public function dashboard()
    {
        return view('dashboard', [
            'in_dev' => file_exists(base_path().'/proc/dash')
        ]);
    }


    /**
     * Switch the current team the user is viewing.
     *
     * @param  Request  $request
     * @param  \Laravel\Spark\Team  $team
     * @return Response
     */
    public function switchCurrentTeam(Request $request, $team)
    {
        abort_unless($request->user()->onTeam($team), 404);
        $request->user()->switchToTeam($team);
        return redirect('/app');
    }
}
