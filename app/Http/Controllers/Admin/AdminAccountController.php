<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminAccountController extends Controller
{
    public function index(Request $request)
    {
        $admins = User::query()
            ->where('role', 'admin')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Admins/Index', [
            'admins'  => $admins,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'admin',
        ]);

        return back()->with('success', "{$request->name} の管理者アカウントを作成しました。");
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', '自分自身のアカウントは削除できません。');
        }

        if ($user->role !== 'admin') {
            return back()->with('error', '管理者アカウントのみ削除できます。');
        }

        $user->delete();

        return back()->with('success', "{$user->name} のアカウントを削除しました。");
    }
}
