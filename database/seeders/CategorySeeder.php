<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => '絵本',       'slug' => 'picture-book'],
            ['name' => 'しぜん・科学', 'slug' => 'science'],
            ['name' => 'どうぶつ',    'slug' => 'animals'],
            ['name' => 'のりもの',    'slug' => 'vehicles'],
            ['name' => 'むかしばなし', 'slug' => 'folktale'],
            ['name' => 'かぞく・きもち', 'slug' => 'family'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
