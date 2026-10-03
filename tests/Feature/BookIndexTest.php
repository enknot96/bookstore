<?php

use App\Models\Book;

function bookWith(string $title, int $price, ?int $ageMin, ?int $ageMax): Book
{
    return Book::create([
        'title'        => $title,
        'author'       => '著者',
        'publisher'    => '出版社',
        'price'        => $price,
        'stock'        => 5,
        'age_min'      => $ageMin,
        'age_max'      => $ageMax,
        'is_published' => true,
    ]);
}

function titles($response): array
{
    return collect($response->viewData('page')['props']['books']['data'])->pluck('title')->all();
}

test('books can be sorted by price', function () {
    bookWith('中', 1000, null, null);
    bookWith('安', 500, null, null);
    bookWith('高', 2000, null, null);

    expect(titles($this->get('/books?sort=price_asc')))->toBe(['安', '中', '高']);
    expect(titles($this->get('/books?sort=price_desc')))->toBe(['高', '中', '安']);
});

test('an unknown sort value falls back to newest first', function () {
    bookWith('先', 1000, null, null);
    bookWith('後', 1000, null, null);

    expect(titles($this->get('/books?sort=evil')))->toBe(['後', '先']);
});

test('age band filter includes overlapping and unrestricted books', function () {
    bookWith('0〜2歳向け', 1000, 0, 2);
    bookWith('3〜5歳向け', 1000, 3, 5);
    bookWith('2〜4歳向け', 1000, 2, 4);
    bookWith('9歳以上', 1000, 9, null);
    bookWith('全年齢', 1000, null, null);

    $result = titles($this->get('/books?age_band=3-5&sort=price_asc'));

    expect($result)->toContain('3〜5歳向け', '2〜4歳向け', '全年齢');
    expect($result)->not->toContain('0〜2歳向け', '9歳以上');

    expect(titles($this->get('/books?age_band=9%2B')))->toContain('9歳以上', '全年齢');
});

test('an unknown age band is ignored', function () {
    bookWith('A', 1000, 0, 2);
    bookWith('B', 1000, 9, null);

    expect(titles($this->get('/books?age_band=nonsense')))->toHaveCount(2);
});

test('home shows only categories that have published books', function () {
    $category = \App\Models\Category::create(['name' => '動物', 'slug' => 'animals']);
    \App\Models\Category::create(['name' => '空カテゴリ', 'slug' => 'empty']);
    bookWith('公開本', 1000, null, null)->categories()->attach($category);
    bookWith('非公開本', 1000, null, null)->update(['is_published' => false]);

    $categories = $this->get('/')->viewData('page')['props']['categories'];

    expect($categories)->toHaveCount(1);
    expect($categories[0]['books_count'])->toBe(1);
});
