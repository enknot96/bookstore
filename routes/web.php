<?php

use App\Http\Controllers\Admin\BookController as AdminBookController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\AdminAccountController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/books', [BookController::class, 'index'])->name('books.index');
Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');

Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Stripe Webhook（CSRF除外のため auth ミドルウェア外）
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle'])->name('stripe.webhook');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

  // カート
  Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
  Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
  Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
  Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

  // チェックアウト
  Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
  Route::post('/checkout/prepare', [CheckoutController::class, 'prepare'])->name('checkout.prepare');
  Route::get('/checkout/complete', [CheckoutController::class, 'complete'])->name('checkout.complete');

  // マイページ：注文履歴
  Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
  Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
  Route::get('/', AdminDashboardController::class)->name('dashboard');
  Route::get('books/trash', [AdminBookController::class, 'trash'])->name('books.trash');
  Route::delete('books/trash/empty', [AdminBookController::class, 'emptyTrash'])->name('books.trash.empty');
  Route::patch('books/bulk-restore', [AdminBookController::class, 'bulkRestore'])->name('books.bulk-restore');
  Route::delete('books/bulk-force-delete', [AdminBookController::class, 'bulkForceDelete'])->name('books.bulk-force-delete');
  Route::delete('books/bulk-destroy', [AdminBookController::class, 'bulkDestroy'])->name('books.bulk-destroy');
  Route::patch('books/{book}/restore', [AdminBookController::class, 'restore'])->withTrashed()->name('books.restore');
  Route::delete('books/{book}/force-delete', [AdminBookController::class, 'forceDelete'])->withTrashed()->name('books.force-delete');
  Route::resource('books', AdminBookController::class)->except(['show']);
  Route::resource('orders', AdminOrderController::class)->only(['index', 'show', 'update']);
  Route::get('settings', [AdminSettingController::class, 'edit'])->name('settings.edit');
  Route::patch('settings', [AdminSettingController::class, 'update'])->name('settings.update');
  Route::get('customers', [AdminCustomerController::class, 'index'])->name('customers.index');
  Route::get('admins', [AdminAccountController::class, 'index'])->name('admins.index');
  Route::post('admins', [AdminAccountController::class, 'store'])->name('admins.store');
  Route::delete('admins/{user}', [AdminAccountController::class, 'destroy'])->name('admins.destroy');
});

require __DIR__ . '/auth.php';
