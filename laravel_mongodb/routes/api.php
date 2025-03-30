<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::prefix('user')->group(function () {
    Route::post('register', [UserController::class, 'register']);
    Route::post('login', [UserController::class, 'login']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [UserController::class, 'logout']);
    });
});

Route::prefix('admin')->group(function () {
    Route::post('register', [AdminController::class, 'register']);
    Route::post('login', [AdminController::class, 'login']);

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AdminController::class, 'logout']);
    });
});

// ✅ Add Product Routes for Testing
Route::prefix('products')->group(function () {
    Route::get('/', [ProductsController::class, 'index']);
    Route::post('/', [ProductsController::class, 'store'])->middleware('auth:admin');
    Route::get('/{id}', [ProductsController::class, 'show']);
    // Use match to handle both PUT and PATCH
    Route::post('/{id}', [ProductsController::class, 'update'])->middleware('auth:admin');
    Route::delete('/{id}', [ProductsController::class, 'destroy'])->middleware('auth:admin');
});
