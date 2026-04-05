<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class ProductUploaded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $product;
    public $uploadedBy;
    public $timestamp;

    public function __construct($product, $uploadedBy, $timestamp)
    {
        $this->product = $product;
        $this->uploadedBy = $uploadedBy;
        $this->timestamp = $timestamp;
    }

    public function broadcastOn()
    {
        return new Channel('admin-dashboard');
    }

    public function broadcastAs()
    {
        return 'admin.product.uploaded';
    }
}
