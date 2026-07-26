<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * プロフィール編集画面を表示
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit');
    }

    /**
     * プロフィール情報（氏名・メールアドレス）を更新
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        return redirect()->route('profile.edit')->with('success', 'プロフィールを更新しました。');
    }

    /**
     * 退会（アカウントを無効化）
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', '退会が完了しました。ご利用ありがとうございました。');
    }
}
