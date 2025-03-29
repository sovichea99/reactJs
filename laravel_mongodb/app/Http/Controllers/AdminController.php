<?php
namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth; // Import the Auth facade
class AdminController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:mongodb.admins',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Admin registered successfully',
            'admin' => $admin,
        ], 201);
    }

    public function login(Request $request)
    {
       $credentials = $request->only('email', 'password');

       if(auth()->guard('admin')->attempt($credentials)){
        $admin = auth()->guard('admin')->user();
        $token = JWTAuth::fromUser($admin);
        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'admin' => $admin
        ]);
       }
       return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken();
            
            // Explicitly use admin guard
            auth()->guard('admin')->logout();
            
            // Invalidate token
            JWTAuth::setToken($token)->invalidate();
    
            return response()->json([
                'message' => 'Admin logged out successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to logout, please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
