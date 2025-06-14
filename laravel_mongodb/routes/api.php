<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserCartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;

// ==================== PUBLIC ROUTES ====================
Route::prefix('user')->group(function () {
    Route::post('register', [UserController::class, 'register']);
    Route::post('login', [UserController::class, 'login']);
});

Route::prefix('admin')->group(function () {
    Route::post('register', [AdminController::class, 'register']);
    Route::post('login', [AdminController::class, 'login']);
});

Route::prefix('products')->group(function () {
    Route::get('/', [ProductsController::class, 'index']);
    Route::get('/{id}', [ProductsController::class, 'show']);
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{id}/products', [CategoryController::class, 'getProductsByCategory']);
});

// ==================== AUTHENTICATED USER ROUTES ====================
Route::middleware('auth:api')->group(function () {
    Route::prefix('user')->group(function () {
        Route::post('logout', [UserController::class, 'logout']);
    });

    Route::prefix('cart')->group(function () {
        Route::get('/{userId}', [UserCartController::class, 'getCart']);
        Route::post('/{userId}', [UserCartController::class, 'addToCart']);
        Route::delete('/{userId}/remove/{productId}', [UserCartController::class, 'removeItem']);
        Route::post('/{userId}/clear', [UserCartController::class, 'clearCart']);
        Route::delete('/{userId}', [UserCartController::class, 'destroyCart']);
    });

    Route::prefix('orders')->group(function () {
        Route::get('/user/{userId}', [OrderController::class, 'userOrders']);
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
    });
});

// ==================== ADMIN ROUTES ====================
Route::middleware('auth:admin')->group(function () {
    Route::prefix('admin')->group(function () {
        Route::post('logout', [AdminController::class, 'logout']);
        Route::get('/users', [UserController::class, 'index']);
    });

    Route::prefix('products')->group(function () {
        Route::post('/', [ProductsController::class, 'store']);
        Route::post('/{id}', [ProductsController::class, 'update']);
        Route::delete('/{id}', [ProductsController::class, 'destroy']);
    });

    Route::prefix('categories')->group(function () {
        Route::post('/', [CategoryController::class, 'store']);
        Route::post('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'getStats']);
        Route::get('/recent-orders', [DashboardController::class, 'getRecentOrders']);
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']); 
        Route::put('/{id}/status', [OrderController::class, 'updateStatus']);
         Route::get('/{id}', [OrderController::class, 'show']);
    });
});

// ==================== TEST ROUTE ====================
Route::get('/test-config', function () {
    $env_value = env('CLOUDINARY_URL');
    echo "Value from env('CLOUDINARY_URL'): <pre>" . print_r($env_value, true) . "</pre>";
    echo "<hr>";
    $config_value = config('cloudinary');
    echo "Value from config('cloudinary'): <pre>" . print_r($config_value, true) . "</pre>";
});