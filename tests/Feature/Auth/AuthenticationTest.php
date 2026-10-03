<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/');
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});

test('users are redirected back to the requested path after login', function () {
    $user = User::factory()->create();

    $this->get('/login?redirect=/books/1');

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(url('/books/1'));
});

test('external redirect targets are ignored after login', function () {
    $user = User::factory()->create();

    foreach (['https://evil.example.com', '//evil.example.com', '/\\evil.example.com'] as $target) {
        $this->get('/login?redirect=' . urlencode($target));

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('/');

        $this->post('/logout');
    }
});
