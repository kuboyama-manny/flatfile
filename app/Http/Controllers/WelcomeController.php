<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\License;
use App\Models\Batch;

class WelcomeController extends Controller
{
    /**
     * Show the application splash screen.
     *
     * @return Response
     */
    public function show()
    {
        return view('new-home');
    }

    /**
     * Redirect /js/adapter.js to the unpkg version
     *
     * @return Response
     */
    public function redirectAdapter()
    {
        return redirect('https://unpkg.com/flatfile-csv-importer/build/dist/index.min.js');
    }

    public function sparkVariables()
    {
        return response()->view('spark-variables')->header('Content-Type', 'application/javascript');
    }
}
