<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'order_items'; // Only needed if storing separately
    
    protected $fillable = [
        'product_id',
        'name',
        'price',
        'quantity',
    ];

    protected $casts = [
        'price' => 'float',
        'quantity' => 'integer',
    ];
}
