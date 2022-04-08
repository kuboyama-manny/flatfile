<?php

namespace App\Http\Middleware;

use Closure;
use Validator;
use App\Models\License;

class ValidateLicense
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $uuid = $request->headers->get('License-Key');
        $validator = Validator::make(['license-key' => $uuid], ['license-key' => 'required|uuid|exists:licenses,key'], [
            'uuid' => 'The :attribute header value must be a proper UUID.',
        ]);
        if (!$validator->passes()) {
            return response()->json(['message' => 'License key invalid', 'errors' => $validator->errors()]);
        }
        $license = License::where('key', $uuid)->first();
        $request->license = $license;
        return $next($request);
    }
}
