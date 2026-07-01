<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBookRequest;
use App\Http\Requests\Admin\UpdateBookRequest;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('categories')
            ->when($request->search, fn($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('title', 'like', "%{$v}%")
                    ->orWhere('author', 'like', "%{$v}%");
            }))
            ->when($request->category, fn($q, $v) => $q->whereHas('categories', fn($q) => $q->where('categories.id', $v)))
            ->when($request->filled('is_published'), fn($q) => $q->where('is_published', $request->boolean('is_published')));

        $books = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Books/Index', [
            'books'      => $books,
            'categories' => Category::orderBy('name')->get(),
            'filters'    => $request->only(['search', 'category', 'is_published']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Books/Create', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function store(StoreBookRequest $request)
    {
        $book = Book::create($request->safe()->except('categories'));
        $book->categories()->sync($request->input('categories', []));

        return redirect()->route('admin.books.index')
            ->with('success', '書籍を登録しました。');
    }

    public function edit(Book $book)
    {
        $book->load('categories');

        return Inertia::render('Admin/Books/Edit', [
            'book'       => $book,
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        $book->update($request->safe()->except('categories'));
        $book->categories()->sync($request->input('categories', []));

        return redirect()->route('admin.books.index')
            ->with('success', '書籍を更新しました。');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return redirect()->route('admin.books.index')
            ->with('success', '書籍を削除しました。');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        Book::whereIn('id', $request->ids)->delete();

        return redirect()->route('admin.books.index')
            ->with('success', count($request->ids) . '件の書籍を削除しました。');
    }
}
