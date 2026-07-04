<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $request->user()->cartItems()
            ->with('book.categories')
            ->get()
            ->map(fn($item) => [
                'id'       => $item->id,
                'quantity' => $item->quantity,
                'book'     => $item->book,
                'subtotal' => $item->book->price * $item->quantity,
            ]);

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'total'     => $cartItems->sum('subtotal'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id'  => ['required', 'exists:books,id'],
            'quantity' => ['integer', 'min:1', 'max:99'],
        ]);

        $book = Book::findOrFail($request->book_id);

        if ($book->stock <= 0) {
            return back()->with('error', '「' . $book->title . '」は在庫切れです。');
        }

        $cartItem = CartItem::firstOrNew([
            'user_id' => $request->user()->id,
            'book_id' => $book->id,
        ]);
        $cartItem->quantity = ($cartItem->quantity ?? 0) + ($request->quantity ?? 1);
        $cartItem->save();

        return back()->with('success', '「' . $book->title . '」をカートに追加しました。');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $this->authorizeCartItem($request, $cartItem);

        $request->validate(['quantity' => ['required', 'integer', 'min:1', 'max:99']]);

        $cartItem->update(['quantity' => $request->quantity]);

        return back();
    }

    public function destroy(Request $request, CartItem $cartItem)
    {
        $this->authorizeCartItem($request, $cartItem);
        $cartItem->delete();

        return back()->with('success', 'カートから削除しました。');
    }

    private function authorizeCartItem(Request $request, CartItem $cartItem): void
    {
        abort_if($cartItem->user_id !== $request->user()->id, 403);
    }
}
