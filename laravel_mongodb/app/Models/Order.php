<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use App\Models\User;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'user_id',
        'total',
        'status',
        'items',
    ];

    protected $casts = [
        'items' => 'array',
    ];

    // 👀 Make items visible in responses
    protected $visible = [
        'id', 'user_id', 'total', 'status', 'items', 'created_at', 'updated_at', 'user'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';
}
