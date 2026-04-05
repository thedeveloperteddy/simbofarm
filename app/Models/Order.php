<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'email',
        'phone',
        'address',
        'total_amount',
        'status',
        'order_items',
        'notes'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'order_items' => 'array',
    ];

    // Accessors for frontend compatibility
    public function getCustomerNameAttribute()
    {
        return $this->customer_name;
    }

    public function getItemsAttribute()
    {
        return $this->order_items;
    }

    public function getTotalAttribute()
    {
        return $this->total_amount;
    }

    public function getStatusAttribute()
    {
        return $this->status;
    }

    public function getAddressAttribute()
    {
        return $this->address;
    }

    public function getPhoneAttribute()
    {
        return $this->phone;
    }

    public function getCreatedAtAttribute()
    {
        return $this->created_at;
    }

    // Scope by status
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
