<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class FixAuthorizationHeader
{
    public function handle(Request $request, Closure $next)
    {
        if (isset($_SERVER['HTTP_AUTHORIZATION']) && !$request->header('Authorization')) {
            $request->headers->set('Authorization', $_SERVER['HTTP_AUTHORIZATION']);
        }

        return $next($request);
    }
}