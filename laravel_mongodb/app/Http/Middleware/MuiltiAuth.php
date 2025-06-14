<?php // app/Http/Middleware/MultiAuth.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class MultiAuth
{
    protected $guards = ['api', 'admin'];

    public function handle($request, Closure $next)
    {
        foreach ($this->guards as $guard) {
            if (Auth::guard($guard)->check()) {
                Auth::shouldUse($guard); // Set the guard for this request
                return $next($request);
            }
        }
        return response()->json(['error' => 'Unauthenticated.'], 401);
    }
}
