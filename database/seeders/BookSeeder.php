<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title' => 'もりのおくりもの',
                'author' => '山田はな',
                'publisher' => 'きのみ出版',
                'description' => '小さなりすが森の仲間たちへ贈り物を届ける旅に出る温かい物語。',
                'price' => 1320,
                'age_min' => 3,
                'age_max' => 6,
                'stock' => 15,
                'is_published' => true,
                'categories' => ['picture-book', 'animals'],
            ],
            [
                'title' => 'そらのいろはなぜあおい',
                'author' => '佐藤けんじ',
                'publisher' => 'そら書房',
                'description' => '空の色に疑問を持った女の子が科学の不思議を発見していく絵本。',
                'price' => 1540,
                'age_min' => 4,
                'age_max' => 8,
                'stock' => 10,
                'is_published' => true,
                'categories' => ['picture-book', 'science'],
            ],
            [
                'title' => 'ちいさなきかんしゃ',
                'author' => '鈴木まこと',
                'publisher' => 'てつどう社',
                'description' => '山あいの小さな駅を走る蒸気機関車と運転士の一日を描いた作品。',
                'price' => 1210,
                'age_min' => 2,
                'age_max' => 5,
                'stock' => 20,
                'is_published' => true,
                'categories' => ['picture-book', 'vehicles'],
            ],
            [
                'title' => 'おばあちゃんのてまり',
                'author' => '中村ふみ',
                'publisher' => 'きのみ出版',
                'description' => '祖母から孫へ受け継がれる手まり作りを通じて、家族の絆を描く。',
                'price' => 1430,
                'age_min' => 4,
                'age_max' => 8,
                'stock' => 8,
                'is_published' => true,
                'categories' => ['picture-book', 'family'],
            ],
            [
                'title' => 'かえるのあまやどり',
                'author' => '田中みどり',
                'publisher' => 'みどり書店',
                'description' => '雨宿り中に出会った様々な生き物たちと友達になるかえるのお話。',
                'price' => 1100,
                'age_min' => 2,
                'age_max' => 5,
                'stock' => 12,
                'is_published' => true,
                'categories' => ['picture-book', 'animals'],
            ],
            [
                'title' => 'たねがとんだ',
                'author' => '小林さくら',
                'publisher' => 'そら書房',
                'description' => '風に運ばれた一粒の種が芽を出し花を咲かせるまでを描く科学絵本。',
                'price' => 1320,
                'age_min' => 3,
                'age_max' => 7,
                'stock' => 18,
                'is_published' => true,
                'categories' => ['science'],
            ],
            [
                'title' => 'おにとこぞう',
                'author' => '渡辺たかし',
                'publisher' => 'むかし話館',
                'description' => '心やさしい鬼と村の子どものほのぼのとした交流を描く日本昔話風絵本。',
                'price' => 1210,
                'age_min' => 3,
                'age_max' => 7,
                'stock' => 9,
                'is_published' => true,
                'categories' => ['folktale'],
            ],
            [
                'title' => 'みんなのバス',
                'author' => '高橋のぞみ',
                'publisher' => 'てつどう社',
                'description' => '町をぐるっとまわるバスに乗り込む乗客たちの一日を描いた絵本。',
                'price' => 1100,
                'age_min' => 2,
                'age_max' => 5,
                'stock' => 14,
                'is_published' => true,
                'categories' => ['vehicles'],
            ],
            [
                'title' => 'ほしのかけら',
                'author' => '山田はな',
                'publisher' => 'きのみ出版',
                'description' => '夜空に落ちてきた星のかけらを届けようと旅に出る兄妹の冒険絵本。',
                'price' => 1540,
                'age_min' => 4,
                'age_max' => 9,
                'stock' => 7,
                'is_published' => true,
                'categories' => ['picture-book'],
            ],
            [
                'title' => 'くまのおやすみ',
                'author' => '伊藤ゆき',
                'publisher' => 'みどり書店',
                'description' => '冬眠前に仲間たちへあいさつに回るくまの親子を描いた寝かしつけ絵本。',
                'price' => 990,
                'age_min' => 1,
                'age_max' => 4,
                'stock' => 22,
                'is_published' => true,
                'categories' => ['picture-book', 'animals'],
            ],
        ];

        foreach ($books as $data) {
            $categorySlugs = $data['categories'];
            unset($data['categories']);

            $book = Book::create($data);

            $categoryIds = Category::whereIn('slug', $categorySlugs)->pluck('id');
            $book->categories()->attach($categoryIds);
        }
    }
}
