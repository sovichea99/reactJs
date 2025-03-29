<?php 

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Products extends Model
{
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
}
