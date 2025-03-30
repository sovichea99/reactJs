<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

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
    Route::get('/', [ProductsController::class, 'index']);  // List all products
    Route::post('/store', [ProductsController::class, 'store'])->middleware('auth:admin'); // Add product
    Route::get('/{id}', [ProductsController::class, 'show']); // View product
    Route::put('/update/{id}', [ProductsController::class, 'update'])->middleware('auth:admin'); // Update product
    Route::delete('/delete/{id}', [ProductsController::class, 'destroy'])->middleware('auth:admin'); // Delete product
});

// ✅ Add new categories for the website
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']); // List all categories
    Route::post('/', [CategoryController::class, 'store'])->middleware('auth:admin'); // Add category
    Route::post('/{id}', [CategoryController::class, 'update'])->middleware('auth:admin'); // Update category
    Route::delete('/{id}', [CategoryController::class, 'destroy'])->middleware('auth:admin'); // Delete category
});
