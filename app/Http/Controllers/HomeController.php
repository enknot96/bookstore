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

    // 公開中の書籍数つき（0冊のカテゴリは表示しない）
    $categories = Category::withCount(['books' => fn($q) => $q->where('is_published', true)])
      ->get()
      ->filter(fn($c) => $c->books_count > 0)
      ->values();

    return Inertia::render('Home', [
      'newArrivals' => $newArrivals,
      'categories' => $categories,
    ]);
  }
}
