<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Product extends Model
{
    use HasFactory, HasUlids, Sluggable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'width',
        'height',
        'weight',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
            ],
        ];
    }

    public function usersAddedToCart(): MorphToMany
    {
        return $this->morphedByMany(User::class, 'cart_items');
    }

    public function inOrders(): MorphToMany
    {
        return $this->morphedByMany(Order::class, 'order_product');
    }
}
