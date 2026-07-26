<?php

use App\Models\User;

test('profile page can be rendered', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/profile');

    $response->assertStatus(200);
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch('/profile', [
        'name' => '新しい名前',
        'email' => 'new-email@example.com',
    ]);

    $response->assertRedirect('/profile');

    $user->refresh();

    expect($user->name)->toBe('新しい名前');
    expect($user->email)->toBe('new-email@example.com');
});

test('password can be updated', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->put('/password', [
        'current_password' => 'password',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertSessionHasNoErrors();

    $user->refresh();

    expect(Hash::check('new-password', $user->password))->toBeTrue();
});

test('password update fails with incorrect current password', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->put('/password', [
        'current_password' => 'wrong-password',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertSessionHasErrors('current_password');
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete('/profile', [
            'password' => 'password',
        ]);

    $response->assertRedirect('/');

    $this->assertGuest();
    expect(User::find($user->id))->toBeNull();
    $this->assertSoftDeleted($user);
});

test('account deletion requires correct password', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/profile')
        ->delete('/profile', [
            'password' => 'wrong-password',
        ]);

    $response->assertSessionHasErrors('password');

    expect($user->fresh())->not->toBeNull();
});

test('deleted account cannot log in again', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->delete('/profile', [
        'password' => 'password',
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
});
