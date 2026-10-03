<?php

use App\Models\Book;

test('sitemap lists published books only', function () {
    $published = Book::create(['title' => '公開', 'author' => 'a', 'publisher' => 'p', 'price' => 100, 'stock' => 1, 'is_published' => true]);
    $hidden = Book::create(['title' => '非公開', 'author' => 'a', 'publisher' => 'p', 'price' => 100, 'stock' => 1, 'is_published' => false]);

    $response = $this->get('/sitemap.xml')->assertOk();

    expect($response->headers->get('Content-Type'))->toContain('application/xml');
    $response->assertSee(route('books.show', $published->id), false)
        ->assertDontSee(route('books.show', $hidden->id), false)
        ->assertSee(route('home'), false);
});

test('robots.txt blocks private areas and points to the sitemap', function () {
    $this->get('/robots.txt')
        ->assertOk()
        ->assertSee('Disallow: /admin')
        ->assertSee('Disallow: /checkout')
        ->assertSee('Sitemap: ' . route('sitemap'));
});
