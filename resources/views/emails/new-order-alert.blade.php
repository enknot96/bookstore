<x-mail::message>
# 新規注文が入りました

**注文番号:** #{{ $order->id }}
**注文日時:** {{ $order->created_at->format('Y年m月d日 H:i') }}

---

## 注文者情報

- **氏名:** {{ $order->user->name }}
- **メール:** {{ $order->user->email }}

---

## 注文内容

@foreach ($order->items as $item)
- {{ $item->book->title }} × {{ $item->quantity }}冊　¥{{ number_format($item->unit_price * $item->quantity) }}
@endforeach

---

**合計金額:** ¥{{ number_format($order->total_amount) }}

---

## 配送先

〒{{ $order->shipping_zip }}
{{ $order->shipping_address }}
{{ $order->shipping_name }} 様

<x-mail::button :url="config('app.url') . '/admin/orders/' . $order->id">
管理画面で確認する
</x-mail::button>

{{ config('app.name') }} 管理システム
</x-mail::message>
