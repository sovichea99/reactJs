<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class UserCart extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'user_carts';  // your collection name

    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',      // reference to user (likely ObjectId string)
        'items',        // array of cart items
        'updated_at',
        'created_at',
    ];

    protected $casts = [
        'items' => 'array', // make sure MongoDB stores this as an array
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->created_at = now();
            $model->updated_at = now();
        });

        static::updating(function ($model) {
            $model->updated_at = now();
        });
    }
}
