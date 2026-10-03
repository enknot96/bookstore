<?php

use App\Models\Book;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

function orderBook(string $title, int $stock, bool $published = true): Book
{
    return Book::create(['title' => $title, 'author' => 'a', 'publisher' => 'p', 'price' => 1000, 'stock' => $stock, 'is_published' => $published]);
}

function orderFor(User $user, array $items): Order
{
    $order = Order::create([
        'user_id' => $user->id, 'status' => 'confirmed', 'total_amount' => 1000,
        'shipping_name' => '山田', 'shipping_zip' => '123-4567', 'shipping_address' => '東京都',
    ]);
    foreach ($items as [$book, $qty]) {
        OrderItem::create(['order_id' => $order->id, 'book_id' => $book->id, 'quantity' => $qty, 'unit_price' => 1000]);
    }

    return $order;
}

test('order pages still render when an ordered book was deleted', function () {
    $user = User::factory()->create();
    $book = orderBook('削除される本', 3);
    $order = orderFor($user, [[$book, 1]]);
    $book->delete();

    $this->actingAs($user)->get('/orders')->assertOk();
    $this->actingAs($user)->get("/orders/{$order->id}")->assertOk();
});

test('reorder adds available books to the cart up to stock and skips unavailable ones', function () {
    $user = User::factory()->create();
    $ok = orderBook('買える本', 2);
    $soldOut = orderBook('在庫切れ', 0);
    $hidden = orderBook('非公開', 5, published: false);
    $order = orderFor($user, [[$ok, 5], [$soldOut, 1], [$hidden, 1]]);

    $this->actingAs($user)->post("/orders/{$order->id}/reorder")
        ->assertRedirect('/cart')
        ->assertSessionHas('success')
        ->assertSessionHas('error');

    expect(CartItem::where('user_id', $user->id)->count())->toBe(1);
    expect(CartItem::where('book_id', $ok->id)->first()->quantity)->toBe(2);
});

test('reorder is rejected when nothing can be added', function () {
    $user = User::factory()->create();
    $order = orderFor($user, [[orderBook('在庫切れ', 0), 1]]);

    $this->actingAs($user)->post("/orders/{$order->id}/reorder")->assertSessionHas('error');

    expect(CartItem::count())->toBe(0);
});

test("one user cannot reorder another user's order", function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $order = orderFor($owner, [[orderBook('本', 3), 1]]);

    $this->actingAs($other)->post("/orders/{$order->id}/reorder")->assertForbidden();
});
