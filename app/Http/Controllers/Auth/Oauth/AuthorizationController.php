<?php

/**
 * this is a copy of the Passport AuthorizationController. Unfortunately we need to have our own version
 * so we can skip the approval screen.
 */

namespace App\Http\Controllers\Auth\OAuth;

use Laravel\Passport\Http\Controllers\AuthorizationController as BaseAuthorizationController;

use Illuminate\Http\Request; //
use Laravel\Passport\TokenRepository; //
use Laravel\Passport\ClientRepository; //
use Psr\Http\Message\ServerRequestInterface; //
use Zend\Diactoros\Response as Psr7Response; //
use Laravel\Passport\Http\Controllers\RetrievesAuthRequestFromSession;

class AuthorizationController extends BaseAuthorizationController
{
    use RetrievesAuthRequestFromSession;

    /**
     * Authorize a client to access the user's account.
     *
     * @param  ServerRequestInterface  $psrRequest
     * @param  Request  $request
     * @param  ClientRepository  $clients
     * @return Response
     */
    public function authorize(
        ServerRequestInterface $psrRequest,
        Request $request,
        ClientRepository $clients,
        TokenRepository $tokens
    ) {
        return $this->withErrorHandling(function () use ($psrRequest, $request, $clients, $tokens) {
            $authRequest = $this->server->validateAuthorizationRequest($psrRequest);

            $scopes = $this->parseScopes($authRequest);

            $token = $tokens->findValidToken(
                $user = $request->user(),
                $client = $clients->find($authRequest->getClient()->getIdentifier())
            );

            if ($token && $token->scopes === collect($scopes)->pluck('id')->all()) {
                return $this->approveRequest($authRequest, $user);
            }

            $request->session()->put('authRequest', $authRequest);

            if ($client->internal) {
                $authRequest = $this->getAuthRequestFromSession($request);

                return $this->convertResponse(
                    $this->server->completeAuthorizationRequest($authRequest, new Psr7Response)
                );
            } else {
                return $this->response->view('passport::authorize', [
                    'client' => $client,
                    'user' => $user,
                    'scopes' => $scopes,
                    'request' => $request,
                ]);
            }
        });
    }
}
