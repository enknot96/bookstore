<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
  protected $fillable = [
    'order_id',
    'book_id',
    'quantity',
    'unit_price',
  ];

  public function order()
  {
    return $this->belongsTo(Order::class);
  }

  public function book()
  {
    // 注文後に書籍が削除されても、注文履歴の表示で null にならないようにする
    return $this->belongsTo(Book::class)->withTrashed();
  }
}
