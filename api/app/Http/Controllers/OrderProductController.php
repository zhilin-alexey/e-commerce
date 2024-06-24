<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderProductController extends Controller
{
    public function getByOrderId(Request $request): JsonResponse
    {
        $request->validate([
            'orderId' => ['required', 'exists:orders,id'],
        ]);
        return response()->json(Auth::user()->orders()->get());
    }
}
