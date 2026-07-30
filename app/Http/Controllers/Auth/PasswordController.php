<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * ログイン中ユーザーのパスワードを更新
     */
    public function update(Request $request): RedirectResponse
    {
        if ($request->user()->isDemoAccount()) {
            return back()->with('error', 'デモアカウントのため、この操作はできません。');
        }

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'          => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'パスワードを更新しました。');
    }
}
