<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = ['user_id', 'book_id', 'quantity'];

    public function book()
    {
        // 削除済みの書籍がカートに残っていても null にならないようにする
        return $this->belongsTo(Book::class)->withTrashed();
    }

    /**
     * 購入できない理由（購入可能なら null）
     * unpublished: 非公開・削除済み / out_of_stock: 在庫切れ / insufficient: 在庫不足
     */
    public function unavailableReason(): ?string
    {
        $book = $this->book;

        if ($book->trashed() || ! $book->is_published) {
            return 'unpublished';
        }
        if ($book->stock <= 0) {
            return 'out_of_stock';
        }
        if ($book->stock < $this->quantity) {
            return 'insufficient';
        }

        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
