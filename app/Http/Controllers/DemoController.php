<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\License;

class DemoController extends Controller
{
    /**
     * Show the demo page
     *
     * @return Response
     */
    public function show(Request $request)
    {
        return view('demo', [
            'in_dev' => file_exists(base_path().'/proc/impt'),
            'license_key' => License::find(1)->key,
            'config' => base64_decode($request->config)
        ]);
    }
    /**
     * Show the test page
     *
     * @return Response
     */
    public function test(Request $request)
    {
        $adapter_url = "/js/adapter.js?cachebust=".time();
        if (file_exists(base_path().'/proc/sdk')) {
            $adapter_url = "/adapter-proxy.js";
        }
        return view('test', [
            'in_dev' => file_exists(base_path().'/proc/impt'),
            'license_key' => License::find(1)->key,
            'adapter_url' => $adapter_url,
            'config' => base64_decode($request->config)
        ]);
    }

     /**
     * Return the proxied adapter
     *
     * @return Response
     */
    public function adapter()
    {
        $client = new \GuzzleHttp\Client();
        $res = $client->get("http://localhost:8080/index.js?cachebust=".time());
        return response($res->getBody(), 200)->header('content-type', $res->getHeader('content-type'));
    }
}
