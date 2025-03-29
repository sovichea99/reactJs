<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth; // Import the Auth facade
class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:mongodb.users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
       $credentials = $request->only('email', 'password');

       if (auth()->guard('web')->attempt($credentials)){
            $user = auth()->guard('web')->user();
            $token = JWTAuth::fromUser($user);
            return response()->json([
               'message' => 'Login successful',
                'access_token' => $token,
                'user' => $user
            ]);
       }
       return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::parseToken();
            // Invalidate the token
            JWTAuth::invalidate($request->token);

            return response()->json([
                'message' => 'User logged out successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to logout, please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
