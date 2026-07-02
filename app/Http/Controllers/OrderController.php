<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items.book')
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, \App\Models\Order $order)
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        $order->load('items.book');

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
