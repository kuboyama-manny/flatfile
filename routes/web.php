<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
use Laravel\Passport\Client;
use Laravel\Passport\ClientRepository;

Route::group(['middleware' => ['force.ssl']], function () {

    Route::get('/', 'WelcomeController@show');
    Route::get('/js/adapter.js', 'WelcomeController@redirectAdapter');
    Route::get('/js/spark-variables.js', 'WelcomeController@sparkVariables');

    Route::get('/home', 'HomeController@show');
    Route::get('/api/v1/teams/{team}/switch', 'HomeController@switchCurrentTeam');

    Route::get('/app', 'HomeController@dashboard');
    Route::get('/app/{path}', 'HomeController@dashboard')->where('path', '.+');
    Route::get('/batches', 'BatchController@index');
    Route::get('/demo', 'DemoController@show');
    Route::get('/test', 'DemoController@test');
    Route::get('/adapter-proxy.js', 'DemoController@adapter');
    Route::get('/importer/{license_key?}', 'ImporterController@show');

    Route::group([
      'prefix' => 'public-api',
      'namespace' => 'PublicApi',
      'middleware' => ['cors', 'validateLicense']
    ], function () {
        Route::apiResource('batches', 'BatchController')->only(['store', 'update']);
        Route::post('batches/{id}/transform-xls', 'BatchController@storeXLS');
        Route::post('batches/{batch}/link-csv', 'BatchController@linkCSV');
        Route::post('batches/{batch}/import-rows', 'BatchController@importRows');
    });
});

/**
 * This handles automatically generating the proper internal login flow for the dashboard.
 */
Route::get('/dashboard-login', function () {
    $in_dev = file_exists(base_path().'/proc/dash');

    $client = Client::where('name', 'Flatfile Dashboard')->where('internal', true)->first();
    $callback_uri = env('DASHBOARD_OAUTH2_CALLBACK', '/app/login-callback');

    if (!$client) {
        $client = Client::create([
            'name' => 'Flatfile Dashboard',
            'internal' => true,
            'secret' => str_random(40),
            'redirect' => $callback_uri,
            'personal_access_client' => false,
            'password_client' => false,
            'revoked' => false
        ]);
    }

    if ($client->redirect != $callback_uri) {
        $client->redirect = $callback_uri;
        $client->save();
    }

    $query = http_build_query([
        'client_id' => $client->id,
        'redirect_uri' => $callback_uri,
        'response_type' => 'token',
        'scope' => '',
    ]);

    return redirect('/oauth/authorize?' . $query);
});

Route::get('/demo-v2', 'WelcomeController@showDemoV2Page');
Route::get('/excel-reader', 'ExcelController@excelReader');
Route::post('/excel-reader', 'ExcelController@excelReader');
