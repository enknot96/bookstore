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

        // 注文番号（#12 や 12）、顧客名、メールアドレスで検索
        if ($request->filled('q')) {
            $keyword = trim($request->q);
            $orderId = ltrim($keyword, '#');

            $query->where(function ($q) use ($keyword, $orderId) {
                if (ctype_digit($orderId)) {
                    $q->orWhere('id', (int) $orderId);
                }
                $q->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%"));
            });
        }

        $orders = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders'   => $orders,
            'statuses' => Order::STATUS_LABELS,
            'filters'  => $request->only(['status', 'q']),
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
