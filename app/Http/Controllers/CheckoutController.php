<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\StripeClient;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $request->user()->cartItems()
            ->with('book')
            ->get()
            ->map(fn($item) => [
                'id'       => $item->id,
                'quantity' => $item->quantity,
                'book'     => $item->book,
                'subtotal' => $item->book->price * $item->quantity,
            ]);

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'カートが空です。');
        }

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'total'     => $cartItems->sum('subtotal'),
        ]);
    }

    public function prepare(Request $request)
    {
        $request->validate([
            'shipping_name'    => ['required', 'string', 'max:100'],
            'shipping_zip'     => ['required', 'string', 'regex:/^\d{3}-?\d{4}$/'],
            'shipping_address' => ['required', 'string', 'max:255'],
        ]);

        $user      = $request->user();
        $cartItems = $user->cartItems()->with('book')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'カートが空です。'], 422);
        }

        // 在庫再チェック（多重注文対策）
        $outOfStock = $cartItems->first(fn($item) => $item->book->stock < $item->quantity);
        if ($outOfStock) {
            return response()->json([
                'error' => '「' . $outOfStock->book->title . '」の在庫が不足しています。カートを確認してください。',
            ], 422);
        }

        $total = $cartItems->sum(fn($item) => $item->book->price * $item->quantity);

        $stripe = new StripeClient(config('services.stripe.secret'));

        $intent = $stripe->paymentIntents->create([
            'amount'   => $total,
            'currency' => 'jpy',
            'metadata' => ['user_id' => $user->id],
        ]);

        $order = Order::create([
            'user_id'           => $user->id,
            'status'            => 'pending',
            'total_amount'      => $total,
            'shipping_name'     => $request->shipping_name,
            'shipping_zip'      => $request->shipping_zip,
            'shipping_address'  => $request->shipping_address,
            'payment_intent_id' => $intent->id,
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'book_id'    => $item->book_id,
                'quantity'   => $item->quantity,
                'unit_price' => $item->book->price,
            ]);
        }

        return response()->json([
            'clientSecret' => $intent->client_secret,
            'orderId'      => $order->id,
        ]);
    }

    public function complete(Request $request)
    {
        $order = Order::where('payment_intent_id', $request->query('payment_intent'))
            ->where('user_id', $request->user()->id)
            ->with('items.book')
            ->firstOrFail();

        return Inertia::render('Checkout/Complete', [
            'order' => $order,
        ]);
    }
}
