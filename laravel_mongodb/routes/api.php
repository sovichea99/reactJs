<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserCartController;

// ==================== USER ROUTES ====================
Route::prefix('user')->group(function () {
    Route::post('register', [UserController::class, 'register']);
    Route::post('login', [UserController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [UserController::class, 'logout']);
    });
});

// ==================== ADMIN ROUTES ====================
Route::prefix('admin')->group(function () {
    Route::post('register', [AdminController::class, 'register']);
    Route::post('login', [AdminController::class, 'login']);

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AdminController::class, 'logout']);
        Route::get('/users', [UserController::class, 'index']);
    });
});

// ==================== PRODUCTS ROUTES ====================
Route::prefix('products')->group(function () {
    Route::get('/', [ProductsController::class, 'index']);
    Route::get('/{id}', [ProductsController::class, 'show']);
    Route::post('/', [ProductsController::class, 'store'])->middleware('auth:admin');
    Route::post('/{id}', [ProductsController::class, 'update'])->middleware('auth:admin');
    Route::delete('/{id}', [ProductsController::class, 'destroy'])->middleware('auth:admin');
});
// ==================== CATEGORIES ROUTES ====================
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store'])->middleware('auth:admin');
    Route::post('/{id}', [CategoryController::class, 'update'])->middleware('auth:admin');
    Route::delete('/{id}', [CategoryController::class, 'destroy'])->middleware('auth:admin');
    Route::get('/{id}/products', [CategoryController::class, 'getProductsByCategory']);
});

// ==================== USER CART ROUTES ====================
Route::prefix('cart')->group(function(){
    Route::get('/{userId}', [UserCartController::class, 'getCart'])->middleware('auth:api');
    Route::post('/{userId}', [UserCartController::class, 'addToCart'])->middleware('auth:api');
    Route::delete('/{userId}/remove/{productId}', [UserCartController::class, 'removeItem'])->middleware('auth:api');
    Route::post('/{userId}/clear', [UserCartController::class, 'clearCart'])->middleware('auth:api');
    Route::delete('/{userId}', [UserCartController::class, 'destroyCart']);
});
Route::get('/test-config', function () {
    // Test 1: Can Laravel read the .env variable directly?
    $env_value = env('CLOUDINARY_URL');
    echo "Value from env('CLOUDINARY_URL'): <pre>" . print_r($env_value, true) . "</pre>";

    echo "<hr>";

    // Test 2: Can Laravel read the value through the config file?
    // This is what the Service Provider uses.
    $config_value = config('cloudinary');
    echo "Value from config('cloudinary'): <pre>" . print_r($config_value, true) . "</pre>";

    // The dd() function will stop execution here and dump the variable.
    // It's a great tool for debugging.
    // dd($config_value);
});