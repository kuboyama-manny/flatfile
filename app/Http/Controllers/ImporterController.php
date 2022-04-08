<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\License;
use Webpatser\Uuid\Uuid;

class ImporterController extends Controller
{
    /**
     * Show the importer UI
     *
     * @return Response
     */
    public function show(Request $request)
    {
        $license = false;
        $features = [];
        if ($request->license_key && Uuid::validate($request->license_key)) {
            $license = License::where('key', $request->license_key)->first();
            if ($license) {
                $license->count_views++;
                $license->save();
                $features = $license->getFeatures();
            }
        }
        return view('importer', ['license' => $license, 'features' => $features]);
    }
}
