<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BookSeederBatch2 extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title' => 'つきよのぱんやさん',
                'author' => '星野つばさ',
                'publisher' => 'つき出版',
                'description' => '満月の夜だけ開くパン屋に迷い込んだ子ぎつねが、不思議なパンと出会う物語。',
                'price' => 1320,
                'age_min' => 3,
                'age_max' => 7,
                'stock' => 16,
                'is_published' => true,
                'categories' => ['picture-book', 'animals'],
            ],
            [
                'title' => 'あめのひのぼうけん',
                'author' => '川口みなみ',
                'publisher' => 'あめ工房',
                'description' => '雨の日、水たまりの中に広がる小さな世界へ迷い込んだ女の子の冒険。',
                'price' => 1210,
                'age_min' => 3,
                'age_max' => 6,
                'stock' => 13,
                'is_published' => true,
                'categories' => ['picture-book', 'science'],
            ],
            [
                'title' => 'きしゃぽっぽのたび',
                'author' => '石田れいこ',
                'publisher' => 'てつどう社',
                'description' => '廃線になった線路を走る古い汽車が、最後の旅で出会う人々を描く物語。',
                'price' => 1430,
                'age_min' => 4,
                'age_max' => 8,
                'stock' => 11,
                'is_published' => true,
                'categories' => ['picture-book', 'vehicles'],
            ],
            [
                'title' => 'たぬきのばけくらべ',
                'author' => '森田ひろし',
                'publisher' => 'むかし話館',
                'description' => '化け方自慢のたぬき兄弟が村の祭りで繰り広げるゆかいな化けくらべ。',
                'price' => 1210,
                'age_min' => 3,
                'age_max' => 7,
                'stock' => 14,
                'is_published' => true,
                'categories' => ['folktale'],
            ],
            [
                'title' => 'おとうさんのたからばこ',
                'author' => '中島さやか',
                'publisher' => 'きのみ出版',
                'description' => '父の古い宝箱に眠る思い出の品々を通じて親子の絆を描く絵本。',
                'price' => 1430,
                'age_min' => 4,
                'age_max' => 9,
                'stock' => 9,
                'is_published' => true,
                'categories' => ['picture-book', 'family'],
            ],
            [
                'title' => 'ほしをかぞえたひつじ',
                'author' => '遠藤あきら',
                'publisher' => 'そら書房',
                'description' => '眠れない夜、星を数えるひつじが夜空の仕組みに気づいていく科学絵本。',
                'price' => 1320,
                'age_min' => 3,
                'age_max' => 7,
                'stock' => 17,
                'is_published' => true,
                'categories' => ['picture-book', 'science'],
            ],
            [
                'title' => 'さかなのがっこう',
                'author' => '松本ひろ子',
                'publisher' => 'うみ書房',
                'description' => '海の中の小さながっこうに通う魚の子どもたちの、はじめての遠泳の日。',
                'price' => 1100,
                'age_min' => 2,
                'age_max' => 6,
                'stock' => 19,
                'is_published' => true,
                'categories' => ['picture-book', 'animals'],
            ],
            [
                'title' => 'あかいじてんしゃ',
                'author' => '前田たくみ',
                'publisher' => 'てつどう社',
                'description' => '兄からゆずり受けた赤い自転車で、はじめて一人で遠くまで出かける少年の一日。',
                'price' => 1210,
                'age_min' => 4,
                'age_max' => 8,
                'stock' => 12,
                'is_published' => true,
                'categories' => ['vehicles'],
            ],
            [
                'title' => 'つるのおんがえしのつづき',
                'author' => '柳田さちこ',
                'publisher' => 'むかし話館',
                'description' => '「つるのおんがえし」のその後を描いた、やさしいオリジナル続編昔話。',
                'price' => 1320,
                'age_min' => 4,
                'age_max' => 8,
                'stock' => 8,
                'is_published' => true,
                'categories' => ['folktale'],
            ],
            [
                'title' => 'かぞくのちいさなにわ',
                'author' => '岡本のどか',
                'publisher' => 'きのみ出版',
                'description' => '家族みんなで少しずつ育てる小さな庭を通して、季節の移ろいと家族の時間を描く。',
                'price' => 1430,
                'age_min' => 3,
                'age_max' => 8,
                'stock' => 10,
                'is_published' => true,
                'categories' => ['picture-book', 'family'],
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
