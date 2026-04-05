<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChatMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'sender_name' => 'John Doe',
                'sender_email' => 'john@example.com',
                'message' => 'Hi, I\'m interested in your organic eggs. Do you deliver?',
                'message_type' => 'customer',
                'is_read' => false,
                'sent_at' => now()->subHours(2),
            ],
            [
                'sender_name' => 'Admin',
                'sender_email' => 'admin@simbofarm.com',
                'message' => 'Hello John! Yes, we offer delivery within 50km radius. What quantity are you interested in?',
                'message_type' => 'admin',
                'is_read' => true,
                'sent_at' => now()->subHours(1)->subMinutes(45),
            ],
            [
                'sender_name' => 'Jane Smith',
                'sender_email' => 'jane@example.com',
                'message' => 'Do you have any special offers on broiler chickens this week?',
                'message_type' => 'customer',
                'is_read' => false,
                'sent_at' => now()->subHours(1),
            ],
            [
                'sender_name' => 'Mike Johnson',
                'sender_email' => 'mike@example.com',
                'message' => 'I need to place an order for 100 day-old chicks. Can you confirm availability?',
                'message_type' => 'customer',
                'is_read' => true,
                'sent_at' => now()->subMinutes(30),
            ],
            [
                'sender_name' => 'Admin',
                'sender_email' => 'admin@simbofarm.com',
                'message' => 'Hi Mike! Yes, we have 100 day-old chicks available. They\'ll be ready for pickup tomorrow.',
                'message_type' => 'admin',
                'is_read' => true,
                'sent_at' => now()->subMinutes(15),
            ],
        ];

        foreach ($messages as $message) {
            DB::table('chat_messages')->insert($message);
        }
    }
}