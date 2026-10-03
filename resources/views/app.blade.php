<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $meta = $page['props']['meta'] ?? [];
            $siteName = config('app.name', 'Laravel');
            $metaDescription = $meta['description'] ?? '年齢やジャンルから、お子さまにぴったりの絵本をさがせるオンライン絵本店「' . $siteName . '」。';
        @endphp
        <title inertia>{{ isset($meta['title']) ? $meta['title'] . ' - ' . $siteName : $siteName }}</title>

        <!-- SEO / OGP（inertia 属性のタグは各ページの <Head> で上書きされる） -->
        <meta name="description" content="{{ $metaDescription }}" inertia="description">
        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:locale" content="ja_JP">
        <meta property="og:type" content="{{ $meta['type'] ?? 'website' }}" inertia="og:type">
        <meta property="og:title" content="{{ isset($meta['title']) ? $meta['title'] . ' - ' . $siteName : $siteName }}" inertia="og:title">
        <meta property="og:description" content="{{ $metaDescription }}" inertia="og:description">
        <meta property="og:image" content="{{ $meta['image'] ?? url('/og-default.jpg') }}" inertia="og:image">
        <meta property="og:url" content="{{ url()->current() }}" inertia="og:url">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="theme-color" content="#431608">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
