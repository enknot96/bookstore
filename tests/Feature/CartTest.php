<?php

use App\Models\Book;
use App\Models\CartItem;
use App\Models\User;

function makeBook(int $stock): Book
{
    return Book::create([
        'title'        => 'テスト絵本',
        'author'       => 'テスト著者',
        'publisher'    => 'テスト出版',
        'price'        => 1000,
        'stock'        => $stock,
        'is_published' => true,
    ]);
}

test('adding to cart is capped at stock', function () {
    $user = User::factory()->create();
    $book = makeBook(3);

    $this->actingAs($user)->post('/cart', ['book_id' => $book->id, 'quantity' => 2])
        ->assertSessionHas('success');

    $this->actingAs($user)->post('/cart', ['book_id' => $book->id, 'quantity' => 2])
        ->assertSessionHas('error');

    expect(CartItem::where('user_id', $user->id)->first()->quantity)->toBe(3);
});

test('updating cart quantity is capped at stock', function () {
    $user = User::factory()->create();
    $book = makeBook(2);
    $item = CartItem::create(['user_id' => $user->id, 'book_id' => $book->id, 'quantity' => 1]);

    $this->actingAs($user)->patch("/cart/{$item->id}", ['quantity' => 10])
        ->assertSessionHas('error');

    expect($item->fresh()->quantity)->toBe(2);
});

test('updating cart quantity within stock succeeds', function () {
    $user = User::factory()->create();
    $book = makeBook(5);
    $item = CartItem::create(['user_id' => $user->id, 'book_id' => $book->id, 'quantity' => 1]);

    $this->actingAs($user)->patch("/cart/{$item->id}", ['quantity' => 4])
        ->assertSessionHasNoErrors();

    expect($item->fresh()->quantity)->toBe(4);
});
