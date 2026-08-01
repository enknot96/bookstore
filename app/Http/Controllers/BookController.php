<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
  public function index(Request $request)
  {
    $query = Book::where('is_published', true)->with('categories');

    if ($request->filled('keyword')) {
      $kw = $request->keyword;
      $query->where(function ($q) use ($kw) {
        $q->where('title', 'like', "%{$kw}%")
          ->orWhere('author', 'like', "%{$kw}%");
      });
    }

    if ($request->filled('category')) {
      $query->whereHas('categories', fn($q) => $q->where('slug', $request->category));
    }

    if ($request->filled('price_min')) {
      $query->where('price', '>=', (int) $request->price_min);
    }

    if ($request->filled('price_max')) {
      $query->where('price', '<=', (int) $request->price_max);
    }

    if ($request->filled('age')) {
      $age = (int) $request->age;
      $query->where(function ($q) use ($age) {
        $q->whereNull('age_min')->orWhere('age_min', '<=', $age);
      })->where(function ($q) use ($age) {
        $q->whereNull('age_max')->orWhere('age_max', '>=', $age);
      });
    }

    $books = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
    $categories = Category::all();

    return Inertia::render('Books/Index', [
      'books' => $books,
      'categories' => $categories,
      'filters' => $request->only(['keyword', 'category', 'price_min', 'price_max', 'age']),
    ]);
  }

  public function show(Book $book)
  {
    if (!$book->is_published) {
      abort(404);
    }

    $book->load('categories');

    $related = Book::where('is_published', true)
      ->whereHas('categories', fn($q) => $q->whereIn('categories.id', $book->categories->pluck('id')))
      ->where('id', '!=', $book->id)
      ->with('categories')
      ->take(4)
      ->get();

    return Inertia::render('Books/Show', [
      'book' => $book,
      'related' => $related,
    ]);
  }
}
