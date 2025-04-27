<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Category extends Model
{
    //
    protected $connection = 'mongodb';
    protected $collection = 'categories';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    protected $appends = [
        'created_at',
        'updated_at',
    ];


    public function getCreatedAtAttribute($value)
    {
        return $this->asDateTime($value);
    }
    public function getUpdatedAtAttribute($value)
    {
        return $this->asDateTime($value);
    }
    public function products()
    {
        return $this->hasMany(Products::class, 'category', 'cat_id');
    }
    public function getCategoryNameAttribute()
    {
        return $this->name;
    }

    public function getCategoryIdAttribute()
    {
        return $this->cat_id;
    }
}
