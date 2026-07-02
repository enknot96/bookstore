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
    'payment_intent_id',
  ];

  public const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  public const STATUS_LABELS = [
    'pending'    => '決済待ち',
    'confirmed'  => '注文確定',
    'processing' => '処理中',
    'shipped'    => '発送済み',
    'delivered'  => '配達完了',
    'cancelled'  => 'キャンセル',
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
