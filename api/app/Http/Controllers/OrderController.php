<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cartItems' => ['required', 'array'],
            'cartItems.*' => ['exists:cart_items,id'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string', 'min:9', 'max:13'],
            'address' => ['required', 'string'],
        ]);

        $user_id = Auth::user() ? Auth::user()->id : session_id();
        $cartItems = CartItem::find($request->cartItems)->all();

        $order = Order::create([
            'user_id' => $user_id,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'price' => Product::whereIn('id', array_column($cartItems, 'product_id'))->sum('price')
        ]);

        $orderProducts = array_map(static function ($cartItem) use ($order) {
             return[
                'id' => Str::ulid(),
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity
            ];
        }, $cartItems);

        OrderProduct::insert($orderProducts);

        CartItem::whereIn('id', $request->cartItems)->delete();

        return response()->json($order);
    }

    public function getByUserId(Request $request)
    {
        return response()
            ->json(Order::where('user_id', Auth::user()->id)
                ->firstOrFail());
    }
}
