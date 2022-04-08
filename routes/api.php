<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register the API routes for your application as
| the routes are automatically authenticated using the API guard and
| loaded automatically by this application's RouteServiceProvider.
|
*/


Route::group([
    'prefix' => 'v1',
    'namespace' => 'API',
    'middleware' => 'auth:api'
], function () {
    Route::apiResource('batches', 'BatchController');
    Route::apiResource('models', 'ModelController');
    Route::apiResource('rows', 'RowController');
    Route::apiResource('end-users', 'EndUserController');
    Route::apiResource('licenses', 'LicenseController')->only(['index']);
    // Route::resource('fields', 'FieldController');
});
