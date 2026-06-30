<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
  protected $fillable = [
    'user_id',
    'status',
    'total_amount',
    'shipping_name',
    'shipping_address',
    'shipping_zip',
    'stripe_session_id',
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function items()
  {
    // 「OrderItem のテーブルに order_id があるはず」と推測している
    return $this->hasMany(OrderItem::class);
  }
}
