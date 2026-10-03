<?php

use App\Models\Book;
use App\Models\Order;
use App\Models\User;

function adminUser(): User
{
    return User::factory()->create(['role' => 'admin']);
}

function dashboardBook(int $stock, bool $published = true): Book
{
    return Book::create([
        'title' => "在庫{$stock}", 'author' => '著者', 'publisher' => '出版社',
        'price' => 1000, 'stock' => $stock, 'is_published' => $published,
    ]);
}

function dashboardOrder(User $user, string $status, int $amount, $createdAt = null): Order
{
    $order = Order::create([
        'user_id' => $user->id, 'status' => $status, 'total_amount' => $amount,
        'shipping_name' => '山田', 'shipping_zip' => '123-4567', 'shipping_address' => '東京都',
    ]);
    if ($createdAt) {
        $order->forceFill(['created_at' => $createdAt])->save();
    }

    return $order;
}

test('dashboard sales only count paid orders of this month', function () {
    $admin = adminUser();
    $customer = User::factory()->create();
    dashboardOrder($customer, 'confirmed', 1000);
    dashboardOrder($customer, 'delivered', 2000);
    dashboardOrder($customer, 'pending', 9999);
    dashboardOrder($customer, 'cancelled', 8888);
    dashboardOrder($customer, 'confirmed', 7777, now()->subMonths(2));

    $this->actingAs($admin)->get('/admin')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('stats.monthSales', 3000)
            ->where('stats.pendingShipment', 2));
});

test('dashboard low stock only lists published books', function () {
    $admin = adminUser();
    dashboardBook(2);
    dashboardBook(0);
    dashboardBook(50);
    dashboardBook(1, published: false);

    $this->actingAs($admin)->get('/admin')
        ->assertInertia(fn ($page) => $page
            ->where('stats.lowStock', 2)
            ->has('lowStockBooks', 2)
            ->where('lowStockBooks.0.stock', 0));
});

test('dashboard is not available to customers', function () {
    $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
});
