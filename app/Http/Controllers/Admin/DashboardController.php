<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'books'      => Book::count(),
                'categories' => Category::count(),
                'orders'     => class_exists(Order::class) ? Order::count() : 0,
            ],
        ]);
    }
}
