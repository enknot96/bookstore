<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $newArrivals = Book::where('is_published', true)
            ->with('categories')
            ->latest()
            ->take(4)
            ->get();

        $categories = Category::all();

        return Inertia::render('Home', [
            'newArrivals' => $newArrivals,
            'categories' => $categories,
        ]);
    }
}
