<?php

namespace App\Http\Controllers;

use App\Mail\NewOrderAlert;
use App\Mail\OrderConfirmed;
use App\Models\Book;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature.'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntentId = $event->data->object->id;

            $order = Order::where('payment_intent_id', $paymentIntentId)->first();

            if ($order && $order->status === 'pending') {
                $order->update(['status' => 'confirmed']);
                $order->load('items.book', 'user');

                // 在庫を減算
                foreach ($order->items as $item) {
                    Book::where('id', $item->book_id)
                        ->where('stock', '>', 0)
                        ->decrement('stock', $item->quantity);
                }

                // カートを空にする
                $order->user->cartItems()->delete();

                // 注文者へサンクスメール
                Mail::to($order->user->email)->send(new OrderConfirmed($order));

                // 管理者へ通知メール（Mailtrapのレートリミット対策で1秒待機）
                $adminEmail = Setting::get('admin_notification_email');
                if ($adminEmail) {
                    sleep(2);
                    Mail::to($adminEmail)->send(new NewOrderAlert($order));
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
