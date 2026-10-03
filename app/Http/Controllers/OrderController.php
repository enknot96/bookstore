<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items.book')
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /** 過去の注文の書籍をカートに追加する（購入できない書籍はスキップ） */
    public function reorder(Request $request, \App\Models\Order $order)
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        $order->load('items.book');

        $added = 0;
        $skipped = 0;

        foreach ($order->items as $item) {
            $book = $item->book;

            if ($book->trashed() || ! $book->is_published || $book->stock <= 0) {
                $skipped++;
                continue;
            }

            $cartItem = CartItem::firstOrNew(['user_id' => $request->user()->id, 'book_id' => $book->id]);
            $cartItem->quantity = min(($cartItem->quantity ?? 0) + $item->quantity, $book->stock, 99);
            $cartItem->save();
            $added++;
        }

        if ($added === 0) {
            return back()->with('error', 'この注文の商品は現在ご購入いただけないため、カートに追加できませんでした。');
        }

        $redirect = redirect()->route('cart.index')->with('success', "{$added}点の商品をカートに追加しました。");

        return $skipped > 0
            ? $redirect->with('error', "{$skipped}点は在庫切れまたは取り扱い終了のため追加できませんでした。")
            : $redirect;
    }

    public function show(Request $request, \App\Models\Order $order)
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        $order->load('items.book');

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
