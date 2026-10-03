<?php

use App\Models\Book;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

function customerWithOrder(array $attrs = []): User
{
    $user = User::factory()->create(['role' => 'customer'] + $attrs);
    $book = Book::create(['title' => 'a', 'author' => 'a', 'publisher' => 'p', 'price' => 1210, 'stock' => 5, 'is_published' => true]);
    $order = Order::create(['user_id' => $user->id, 'status' => 'confirmed', 'total_amount' => 1210, 'shipping_name' => '玉木', 'shipping_zip' => '123-4567', 'shipping_address' => '東京都']);
    OrderItem::create(['order_id' => $order->id, 'book_id' => $book->id, 'quantity' => 1, 'unit_price' => 1210]);
    CartItem::create(['user_id' => $user->id, 'book_id' => $book->id, 'quantity' => 1]);

    return $user;
}

test('admin can delete a customer along with their orders and cart', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $customer = customerWithOrder();

    $this->actingAs($admin)->delete("/admin/customers/{$customer->id}")->assertSessionHas('success');

    expect(User::find($customer->id))->toBeNull();
    expect(User::withTrashed()->find($customer->id))->not->toBeNull();
    expect(Order::where('user_id', $customer->id)->count())->toBe(0);
    expect(OrderItem::count())->toBe(0);
    expect(CartItem::count())->toBe(0);
});

test('admins, demo accounts, and oneself cannot be deleted as customers', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $otherAdmin = User::factory()->create(['role' => 'admin']);
    $demo = customerWithOrder(['email' => 'customer@example.com']);

    $this->actingAs($admin)->delete("/admin/customers/{$otherAdmin->id}")->assertSessionHas('error');
    $this->actingAs($admin)->delete("/admin/customers/{$admin->id}")->assertSessionHas('error');
    $this->actingAs($admin)->delete("/admin/customers/{$demo->id}")->assertSessionHas('error');

    expect(User::find($otherAdmin->id))->not->toBeNull();
    expect(User::find($demo->id))->not->toBeNull();
    expect(Order::where('user_id', $demo->id)->count())->toBe(1);
});

test('customers cannot use the delete endpoint, and the demo admin is blocked', function () {
    $victim = customerWithOrder();

    $this->actingAs(User::factory()->create(['role' => 'customer']))->delete("/admin/customers/{$victim->id}")->assertForbidden();

    $demoAdmin = User::factory()->create(['email' => 'admin@example.com', 'role' => 'admin']);
    $this->actingAs($demoAdmin)->delete("/admin/customers/{$victim->id}")->assertSessionHas('error');
    expect(User::find($victim->id))->not->toBeNull();
});

test('admin order pages still render for orders of a soft-deleted user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $customer = customerWithOrder();
    $order = Order::where('user_id', $customer->id)->first();
    $customer->delete();

    $this->actingAs($admin)->get('/admin/orders')->assertOk();
    $this->actingAs($admin)->get("/admin/orders/{$order->id}")->assertOk();
});
