<?php

use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get(
    '/user', function (Request $request) {
    return Auth::user();
}
);

Route::get('/products', [ProductController::class, 'getMultiple'])
    ->name('products.multiple');

Route::get('/product/{slug}', [ProductController::class, 'getBySlug'])
    ->name('products.bySlug');

Route::post('/cart', [CartItemController::class, 'store'])
    ->name('products.addToCart');

Route::get('/cart', [CartItemController::class, 'getByUserId'])
    ->name('products.cart');

Route::patch('/cart', [CartItemController::class, 'edit'])
    ->name('products.cart.edit');

Route::delete('/cart', [CartItemController::class, 'destroy'])
    ->name('products.cart.destroy');

Route::post('/orders', [OrderController::class, 'store']);

Route::get('/orders/{orderId}', [CartItemController::class, 'getByOrderId'])
    ->name('products.order');
