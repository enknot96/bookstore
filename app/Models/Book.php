<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use SoftDeletes;
  protected $fillable = [
    'title',
    'author',
    'publisher',
    'description',
    'price',
    'age_min',
    'age_max',
    'stock',
    'is_published',
    'cover_image_path',
  ];

  protected function casts(): array
  {
    return [
      'is_published' => 'boolean',
    ];
  }

  public function categories()
  {
    return $this->belongsToMany(Category::class);
  }

  public function orderItems()
  {
    return $this->hasMany(OrderItem::class);
  }
}
