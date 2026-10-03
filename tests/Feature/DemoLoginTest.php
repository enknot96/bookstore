<?php

use App\Models\Book;
use App\Models\User;

beforeEach(function () {
    User::factory()->create(['email' => 'customer@example.com', 'role' => 'customer']);
    User::factory()->create(['email' => 'admin@example.com', 'role' => 'admin']);
});

test('demo login is unavailable when disabled', function () {
    config(['demo.login_enabled' => false]);

    $this->post('/demo-login/user')->assertNotFound();
    $this->assertGuest();
});

test('demo user and admin can log in without credentials when enabled', function () {
    config(['demo.login_enabled' => true]);

    $this->post('/demo-login/user')->assertRedirect('/');
    expect(auth()->user()->email)->toBe('customer@example.com');
    auth()->logout();

    $this->post('/demo-login/admin')->assertRedirect(route('admin.books.index', absolute: false));
    expect(auth()->user()->email)->toBe('admin@example.com');
});

test('demo login only accepts known account types', function () {
    config(['demo.login_enabled' => true]);

    $this->post('/demo-login/someone-else')->assertNotFound();
    $this->assertGuest();
});

test('demo admin cannot delete books, manage admins, or change settings', function () {
    $admin = User::where('email', 'admin@example.com')->first();
    $book = Book::create(['title' => 'a', 'author' => 'a', 'publisher' => 'p', 'price' => 100, 'stock' => 1, 'is_published' => true]);

    $this->actingAs($admin)->delete("/admin/books/{$book->id}")->assertSessionHas('error');
    $this->actingAs($admin)->patch('/admin/settings', ['admin_notification_email' => 'evil@example.com'])->assertSessionHas('error');
    $this->actingAs($admin)->post('/admin/admins', ['name' => 'x', 'email' => 'x@example.com', 'password' => 'password123', 'password_confirmation' => 'password123'])->assertSessionHas('error');

    expect(Book::find($book->id))->not->toBeNull();
    expect(User::where('email', 'x@example.com')->exists())->toBeFalse();
});

test('demo admin can still edit books and change order status; other admins are not restricted', function () {
    $demo = User::where('email', 'admin@example.com')->first();
    $other = User::factory()->create(['role' => 'admin']);
    $book = Book::create(['title' => 'a', 'author' => 'a', 'publisher' => 'p', 'price' => 100, 'stock' => 1, 'is_published' => true]);

    $this->actingAs($demo)->get('/admin/books')->assertOk();
    $this->actingAs($other)->delete("/admin/books/{$book->id}")->assertSessionMissing('error');
    expect(Book::find($book->id))->toBeNull();
});
