<?php

namespace App\Http\Controllers;

use App\Models\Book;

class SeoController extends Controller
{
    public function sitemap()
    {
        $urls = [
            ['loc' => route('home'), 'lastmod' => null],
            ['loc' => route('books.index'), 'lastmod' => null],
            ['loc' => route('legal.tokushoho'), 'lastmod' => null],
            ['loc' => route('legal.privacy'), 'lastmod' => null],
            ['loc' => route('contact'), 'lastmod' => null],
        ];

        Book::where('is_published', true)
            ->orderBy('id')
            ->get(['id', 'updated_at'])
            ->each(function ($book) use (&$urls) {
                $urls[] = ['loc' => route('books.show', $book->id), 'lastmod' => $book->updated_at?->toAtomString()];
            });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $url) {
            $xml .= '  <url><loc>' . e($url['loc']) . '</loc>'
                . ($url['lastmod'] ? '<lastmod>' . e($url['lastmod']) . '</lastmod>' : '')
                . "</url>\n";
        }
        $xml .= '</urlset>' . "\n";

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots()
    {
        $lines = [
            'User-agent: *',
            'Disallow: /admin',
            'Disallow: /cart',
            'Disallow: /checkout',
            'Disallow: /orders',
            'Disallow: /profile',
            '',
            'Sitemap: ' . route('sitemap'),
        ];

        return response(implode("\n", $lines) . "\n", 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
