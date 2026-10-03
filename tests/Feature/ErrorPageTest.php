<?php

use Inertia\Testing\AssertableInertia as Assert;

test('unknown urls render the Japanese error page in production', function () {
    app()->detectEnvironment(fn () => 'production');

    $this->get('/this-page-does-not-exist')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('Error')->where('status', 404));
});

test('unpublished books render the error page in production', function () {
    app()->detectEnvironment(fn () => 'production');

    $book = \App\Models\Book::create([
        'title' => '非公開', 'author' => '著者', 'publisher' => '出版社',
        'price' => 1000, 'stock' => 1, 'is_published' => false,
    ]);

    $this->get("/books/{$book->id}")
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('Error')->where('status', 404));
});
