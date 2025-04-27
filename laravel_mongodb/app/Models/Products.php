<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;  // Correct namespace for MongoDB model

class Products extends Eloquent
{
    // app/Models/Products.php

    // Add these properties to ensure consistent ID naming
    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;

    // Add this method to ensure _id is included in JSON responses
    protected function getArrayableItems(array $values)
    {
        // Convert 'id' to '_id' for MongoDB compatibility
        if (array_key_exists('id', $values)) {
            $values['_id'] = $values['id'];
            unset($values['id']);
        }

        return parent::getArrayableItems($values);
    }
    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'category',
        'image', // Add image field
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];

    protected $appends = ['image_url'];

    // Generate Full Image URL
    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    // Remove manual 'id' setting logic
    public static function boot()
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

    public function category()
    {
        return $this->belongsTo(Category::class, 'category', '_id');
    }
}
