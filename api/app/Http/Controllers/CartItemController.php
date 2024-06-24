<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CartItemController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'productId' => ['required', 'string', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $user = Auth::user();

        $user_id = $user ? $user->id : session_id();

        $cartItem = CartItem::create(
            [
                'user_id' => $user_id,
                'product_id' => $request->productId,
                'quantity' => $request->quantity,
            ]
        );

        return response()->json($cartItem);
    }

    public function getByUserId(Request $request): JsonResponse
    {
        $request->validate([
            'productsId' => ['array'],
            'productsId.*' => ['exists:products,id'],
        ]);
        $user_id = $request->user() ? $request->user()->id : session_id();

        $query = CartItem::where('user_id', $user_id);
        if ($request->has('productsId')) {
            $query->whereIn('product_id', $request->productsId);
        }

        $items = $query->join('products', 'cart_items.product_id', 'products.id')->select('cart_items.*', 'products.price', 'products.name as product_name')->get();

        return response()->json($items);
    }

    public function edit(Request $request): Response
    {
        $request->validate([
            'productsId' => ['required', 'array'],
            'productsId.*' => ['exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1']
        ]);

        $user_id = Auth::user() ? Auth::user()->id : session_id();

        CartItem::whereIn('id', $request->productsId)
            ->where('user_id', $user_id)
            ->update(['quantity' => $request->quantity]);

        return response()->noContent();
    }

    public function destroy(Request $request): Response
    {
        $request->validate([
            'productsId' => ['required', 'array'],
            'productsId.*' => ['exists:products,id'],
        ]);

        $user_id = Auth::user() ? Auth::user()->id : session_id();
        CartItem::whereIn('product_id', $request->productsId)
            ->where('user_id', $user_id)
            ->delete();

        return response()->noContent();
    }
}
