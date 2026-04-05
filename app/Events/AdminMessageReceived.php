<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class AdminMessageReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $message;
    public $sender;
    public $timestamp;

    public function __construct($message, $sender, $timestamp)
    {
        $this->message = $message;
        $this->sender = $sender;
        $this->timestamp = $timestamp;
    }

    public function broadcastOn()
    {
        return new Channel('admin-chat');
    }

    public function broadcastAs()
    {
        return 'admin.message.received';
    }
}
