<x-mail::message>
# ご注文ありがとうございます

{{ $order->shipping_name }} 様

BookStore にてご注文が確定しました。

---

**注文番号:** #{{ $order->id }}
**注文日:** {{ $order->created_at->format('Y年m月d日 H:i') }}

---

## ご注文内容

@foreach ($order->items as $item)
- {{ $item->book->title }} × {{ $item->quantity }}冊　¥{{ number_format($item->unit_price * $item->quantity) }}
@endforeach

---

**合計金額:** ¥{{ number_format($order->total_amount) }}

---

## お届け先

〒{{ $order->shipping_zip }}
{{ $order->shipping_address }}
{{ $order->shipping_name }} 様

---

ご不明な点はお気軽にお問い合わせください。

<x-mail::button :url="config('app.url')">
BookStore トップへ
</x-mail::button>

{{ config('app.name') }}
</x-mail::message>
