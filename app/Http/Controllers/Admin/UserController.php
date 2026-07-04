<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->withCount('orders')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only('search', 'role'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', 'in:admin,customer'],
        ]);

        // 自分自身のロールは変更不可
        if ($user->id === $request->user()->id) {
            return back()->with('error', '自分自身のロールは変更できません。');
        }

        $user->update(['role' => $request->role]);

        $label = $request->role === 'admin' ? '管理者' : '一般ユーザー';
        return back()->with('success', "{$user->name} のロールを「{$label}」に変更しました。");
    }
}
