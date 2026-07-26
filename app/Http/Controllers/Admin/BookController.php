<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBookRequest;
use App\Http\Requests\Admin\UpdateBookRequest;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $books = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Books/Index', [
            'books'        => $books,
            'categories'   => Category::orderBy('name')->get(),
            'filters'      => $request->only(['search', 'category', 'is_published']),
            'trashedCount' => Book::onlyTrashed()->count(),
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
        $data = $request->safe()->except(['categories', 'cover_image']);
        $data['cover_image_path'] = null;

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'r2');
            $data['cover_image_path'] = Storage::disk('r2')->url($path);
        }

        $book = Book::create($data);
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
        $data = $request->safe()->except(['categories', 'cover_image']);

        if ($request->hasFile('cover_image')) {
            $this->deleteR2Image($book->cover_image_path);
            $path = $request->file('cover_image')->store('covers', 'r2');
            $data['cover_image_path'] = Storage::disk('r2')->url($path);
        }

        $book->update($data);
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

    public function trash(Request $request)
    {
        $books = Book::onlyTrashed()
            ->when($request->search, fn($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('title', 'like', "%{$v}%")
                    ->orWhere('author', 'like', "%{$v}%");
            }))
            ->orderBy('deleted_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Books/Trash', [
            'books'   => $books,
            'filters' => $request->only('search'),
        ]);
    }

    public function restore(Book $book)
    {
        $book->restore();

        return redirect()->route('admin.books.trash')
            ->with('success', "「{$book->title}」を復元しました。");
    }

    public function forceDelete(Book $book)
    {
        $this->deleteR2Image($book->cover_image_path);
        $book->forceDelete();

        return redirect()->route('admin.books.trash')
            ->with('success', "「{$book->title}」を完全に削除しました。");
    }

    public function bulkRestore(Request $request)
    {
        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        Book::onlyTrashed()->whereIn('id', $request->ids)->restore();

        return redirect()->route('admin.books.trash')
            ->with('success', count($request->ids) . '件を復元しました。');
    }

    public function bulkForceDelete(Request $request)
    {
        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $books = Book::onlyTrashed()->whereIn('id', $request->ids)->get();
        foreach ($books as $book) {
            $this->deleteR2Image($book->cover_image_path);
        }
        Book::onlyTrashed()->whereIn('id', $request->ids)->forceDelete();

        return redirect()->route('admin.books.trash')
            ->with('success', count($request->ids) . '件を完全に削除しました。');
    }

    public function emptyTrash()
    {
        $books = Book::onlyTrashed()->get();
        foreach ($books as $book) {
            $this->deleteR2Image($book->cover_image_path);
        }
        $count = $books->count();
        Book::onlyTrashed()->forceDelete();

        return redirect()->route('admin.books.trash')
            ->with('success', "ゴミ箱を空にしました（{$count}件削除）。");
    }

    private function deleteR2Image(?string $url): void
    {
        if (!$url) return;

        $baseUrl = rtrim(config('filesystems.disks.r2.url', ''), '/');
        if ($baseUrl && str_starts_with($url, $baseUrl)) {
            $path = ltrim(str_replace($baseUrl, '', $url), '/');
            Storage::disk('r2')->delete($path);
        }
    }
}
