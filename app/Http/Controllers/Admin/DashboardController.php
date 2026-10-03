<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $lowStock = Book::where('is_published', true)
            ->where('stock', '<=', Book::LOW_STOCK_THRESHOLD);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'publishedBooks'  => Book::where('is_published', true)->count(),
                // 注文確定済みで、発送対応が必要な注文
                'pendingShipment' => Order::where('status', 'confirmed')->count(),
                'monthSales'      => (int) Order::whereIn('status', Order::PAID_STATUSES)
                    ->where('created_at', '>=', now()->startOfMonth())
                    ->sum('total_amount'),
                'lowStock'        => (clone $lowStock)->count(),
            ],
            'recentOrders' => Order::with('user:id,name')
                ->latest()
                ->take(5)
                ->get(['id', 'user_id', 'status', 'total_amount', 'created_at']),
            'lowStockBooks' => $lowStock
                ->orderBy('stock')
                ->take(5)
                ->get(['id', 'title', 'stock']),
            'statuses' => Order::STATUS_LABELS,
        ]);
    }
}
