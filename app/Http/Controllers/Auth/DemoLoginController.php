<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/** ポートフォリオ用：ID・パスワード入力なしでデモアカウントにログインする */
class DemoLoginController extends Controller
{
    private const EMAILS = [
        'user'  => 'customer@example.com',
        'admin' => 'admin@example.com',
    ];

    public function __invoke(Request $request, string $type): RedirectResponse
    {
        abort_unless(config('demo.login_enabled'), 404);

        $email = self::EMAILS[$type];

        // 保護対象のデモアカウント以外にはログインさせない
        abort_unless(in_array($email, config('demo.protected_emails'), true), 404);

        $user = User::where('email', $email)->first();

        if (! $user) {
            return back()->with('error', 'デモアカウントが見つかりません。');
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect($user->role === 'admin' ? route('admin.books.index', absolute: false) : '/');
    }
}
