<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
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

                // 注文確定後にカートを空にする
                $order->user->cartItems()->delete();
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
