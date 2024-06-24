<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use function Laravel\Prompts\select;

class ProductController extends Controller
{
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'gt:0'],
            'width' => ['required', 'numeric', 'gt:0'],
            'height' => ['required', 'numeric', 'gt:0'],
            'weight' => ['required', 'numeric', 'gt:0'],
        ]);
        $user_id = Auth::user() ? Auth::user()->id : session_id();

        $product = Product::create(
            $request->only('name', 'description', 'price', 'width', 'height', 'weight')
        );

        return response()->json($product);
    }

    public function getBySlug(Request $request): \Illuminate\Http\JsonResponse
    {
        return response()->json(Product::where('slug', $request->slug)->firstOrFail());
    }

    public function getMultiple(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'category' => ['array'],
            'category.*' => ['string', 'exists:categories,id'],
            'minPrice' => ['numeric', 'gt:0'],
            'maxPrice' => ['numeric', 'gt:0'],
            'minWidth' => ['numeric', 'gt:0'],
            'maxWidth' => ['numeric', 'gt:0'],
            'minHeight' => ['numeric', 'gt:0'],
            'maxHeight' => ['numeric', 'gt:0'],
            'minWeight' => ['numeric', 'gt:0'],
            'maxWeight' => ['numeric', 'gt:0'],
        ]);

        $query = Product::query();

        if ($request->has('category')) {
            $query->whereIn('category_id', $request->category);
        }

        if ($request->has('minPrice')) {
            $query->where('price', '>=', $request->minPrice);
        }

        if ($request->has('maxPrice')) {
            $query->where('price', '<=', $request->maxPrice);
        }

        if ($request->has('minWidth')) {
            $query->where('width', '>=', $request->minWidth);
        }

        if ($request->has('maxWidth')) {
            $query->where('width', '<=', $request->maxWidth);
        }

        if ($request->has('minHeight')) {
            $query->where('height', '>=', $request->minHeight);
        }

        if ($request->has('maxHeight')) {
            $query->where('height', '<=', $request->maxHeight);
        }

        if ($request->has('minWeight')) {
            $query->where('weight', '>=', $request->minWeight);
        }

        if ($request->has('maxWeight')) {
            $query->where('weight', '<=', $request->maxWeight);
        }

        $user_id = Auth::user() ? Auth::user()->id : session_id();

        $query->leftJoin('cart_items', 'products.id', '=', 'cart_items.product_id')
            ->selectSub(function ($query) use ($user_id) {
                $query->selectRaw('cart_items.quantity')
                    ->from('cart_items')
                    ->where('cart_items.user_id', '=', $user_id)
                    ->whereColumn('cart_items.product_id', 'products.id')
                    ->limit(1);
            }, 'quantity')->select('products.*', 'quantity')->distinct();

        return response()->json($query->get());
    }
}
