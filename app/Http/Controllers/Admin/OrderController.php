<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders'   => $orders,
            'statuses' => Order::STATUS_LABELS,
            'filters'  => $request->only('status'),
        ]);
    }

    public function show(Order $order)
    {
        $order->load('user', 'items.book');

        return Inertia::render('Admin/Orders/Show', [
            'order'   => $order,
            'statuses' => Order::STATUS_LABELS,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', 'in:' . implode(',', Order::STATUSES)],
        ]);

        $order->update(['status' => $request->status]);

        return back()->with('success', 'ステータスを更新しました。');
    }
}
