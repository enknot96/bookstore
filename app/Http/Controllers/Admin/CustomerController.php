<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->when($request->search, fn($q) => $q->where(fn($q) => $q
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")))
            ->withCount('orders')
            ->withSum('orders', 'total_amount')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters'   => $request->only('search'),
        ]);
    }

    /**
     * 顧客を削除する。ユーザーはソフトデリート、注文・注文明細・カートは削除する。
     * 在庫は決済時に減算済みのため、ここでは戻さない。
     */
    public function destroy(Request $request, User $customer)
    {
        if ($customer->role !== 'customer' || $customer->isDemoAccount() || $customer->id === $request->user()->id) {
            return back()->with('error', 'このユーザーは削除できません。');
        }

        DB::transaction(function () use ($customer) {
            $customer->orders()->each(function ($order) {
                $order->items()->delete();
                $order->delete();
            });
            $customer->cartItems()->delete();
            $customer->delete();
        });

        return back()->with('success', "顧客「{$customer->name}」と、その注文を削除しました。");
    }
}
