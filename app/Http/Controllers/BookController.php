<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookController extends Controller
{
  /** 年齢帯のキー => [下限, 上限]（上限は帯の最大年齢） */
  public const AGE_BANDS = [
    '0-2' => [0, 2],
    '3-5' => [3, 5],
    '6-8' => [6, 8],
    '9+' => [9, 99],
  ];

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

    if (isset(self::AGE_BANDS[$request->age_band])) {
      [$bandMin, $bandMax] = self::AGE_BANDS[$request->age_band];
      // 書籍の対象年齢（null は制限なし）と年齢帯が重なる本
      $query->where(function ($q) use ($bandMax) {
        $q->whereNull('age_min')->orWhere('age_min', '<=', $bandMax);
      })->where(function ($q) use ($bandMin) {
        $q->whereNull('age_max')->orWhere('age_max', '>=', $bandMin);
      });
    }

    match ($request->sort) {
      'price_asc' => $query->orderBy('price', 'asc')->orderBy('id', 'desc'),
      'price_desc' => $query->orderBy('price', 'desc')->orderBy('id', 'desc'),
      default => $query->orderBy('created_at', 'desc')->orderBy('id', 'desc'),
    };

    $books = $query->paginate(12)->withQueryString();
    $categories = Category::all();

    return Inertia::render('Books/Index', [
      'books' => $books,
      'categories' => $categories,
      'filters' => $request->only(['keyword', 'category', 'price_min', 'price_max', 'age', 'age_band', 'sort']),
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

    // クローラー向けに、サーバー側（app.blade.php）で出力するメタ情報
    $description = $book->description
      ? Str::limit(preg_replace('/\s+/u', ' ', trim($book->description)), 120, '…')
      : "{$book->author}（{$book->publisher}）の絵本です。";

    return Inertia::render('Books/Show', [
      'book' => $book,
      'related' => $related,
      'meta' => [
        'title' => $book->title,
        'description' => $description,
        'image' => $book->cover_image_path,
        'type' => 'product',
      ],
    ]);
  }
}
