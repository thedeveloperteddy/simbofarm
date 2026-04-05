<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'p_name',
        'p_discription',
        'p_price',
        'p_number_of_sallary',
        'p_type',
        'p_rating',
        'p_midea',
        'p_date',
        'is_active'
    ];

    protected $casts = [
        'p_price' => 'decimal:2',
        'p_rating' => 'decimal:1',
        'p_date' => 'timestamp',
        'is_active' => 'boolean',
    ];

    // Accessors for frontend compatibility
    public function getNameAttribute()
    {
        return $this->p_name;
    }

    public function getDescriptionAttribute()
    {
        return $this->p_discription;
    }

    public function getPriceAttribute()
    {
        return $this->p_price;
    }

    public function getStockAttribute()
    {
        return $this->p_number_of_sallary;
    }

    public function getCategoryAttribute()
    {
        return $this->p_type;
    }

    public function getRatingAttribute()
    {
        return $this->p_rating;
    }

    public function getImageAttribute()
    {
        return $this->p_midea;
    }

    public function getCreatedAtAttribute()
    {
        return $this->p_date;
    }

    // Scope for active products
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('p_type', $category);
    }
}
