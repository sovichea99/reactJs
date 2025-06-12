<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Products extends Eloquent
{
    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'cloudinary_id',
        'name',
        'description',
        'price',
        'stock',
        'category',
        'image',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];

    //protected $appends = ['image_url'];

    public $timestamps = true;  // Let Laravel handle timestamps automatically

    public function getImageUrlAttribute()
    {
        if (empty($this->image) || !is_string($this->image)) {
            return null;
        }
        return $this->image;
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category', '_id');
    }
}
