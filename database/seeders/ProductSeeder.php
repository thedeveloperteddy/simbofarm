<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'p_name' => 'Fresh Organic Eggs',
                'p_description' => 'Premium quality organic eggs from free-range chickens. Perfect for healthy breakfast and baking.',
                'p_price' => 2.50,
                'p_stock' => 100,
                'p_type' => 'eggs',
                'p_rating' => 4.5,
                'p_image' => 'https://images.unsplash.com/photo-1518569656558-1f25e69393e7?w=400',
                'is_active' => true,
            ],
            [
                'p_name' => 'Premium Broiler Chicken',
                'p_description' => 'High-quality broiler chicken, perfect for grilling, roasting, or frying. Farm-fresh and hormone-free.',
                'p_price' => 15.00,
                'p_stock' => 50,
                'p_type' => 'broilers',
                'p_rating' => 4.8,
                'p_image' => 'https://images.unsplash.com/photo-1528699342362-5e6c67b49420?w=400',
                'is_active' => true,
            ],
            [
                'p_name' => 'Day-Old Chicks',
                'p_description' => 'Healthy and active day-old chicks, vaccinated and ready for brooding. Ideal for poultry farming.',
                'p_price' => 1.20,
                'p_stock' => 200,
                'p_type' => 'chicks',
                'p_rating' => 4.2,
                'p_image' => 'https://images.unsplash.com/photo-1577596275866-10ad5c0e7c77?w=400',
                'is_active' => true,
            ],
            [
                'p_name' => 'Premium Chicken Feed',
                'p_description' => 'Nutritionally balanced chicken feed for optimal growth and health. Contains essential vitamins and minerals.',
                'p_price' => 25.00,
                'p_stock' => 30,
                'p_type' => 'feed',
                'p_rating' => 4.6,
                'p_image' => 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400',
                'is_active' => true,
            ],
            [
                'p_name' => 'Brown Eggs (Dozen)',
                'p_description' => 'Farm-fresh brown eggs from happy, free-range chickens. Rich in nutrients and perfect for any recipe.',
                'p_price' => 3.00,
                'p_stock' => 80,
                'p_type' => 'eggs',
                'p_rating' => 4.7,
                'p_image' => 'https://images.unsplash.com/photo-1505253716362-1aea1d5d94c2?w=400',
                'is_active' => true,
            ],
            [
                'p_name' => 'Organic Broiler Chicken',
                'p_description' => 'Certified organic broiler chicken raised without antibiotics or hormones. Perfect for health-conscious consumers.',
                'p_price' => 18.50,
                'p_stock' => 25,
                'p_type' => 'broilers',
                'p_rating' => 4.9,
                'p_image' => 'https://images.unsplash.com/photo-1546869209-fbb3689530d2?w=400',
                'is_active' => true,
            ],
            [
                'p_name' => 'Layer Chicks',
                'p_description' => 'High-quality layer chicks bred for high egg production. Vaccinated and disease-free.',
                'p_price' => 1.50,
                'p_stock' => 150,
                'p_type' => 'chicks',
                'p_rating' => 4.3,
                'p_image' => 'https://images.unsplash.com/photo-1577596275866-10ad5c0e7c77?w=400',
                'is_active' => true,
            ],
            [
                'p_name' => 'Starter Feed',
                'p_description' => 'Specialized starter feed for young chicks (0-4 weeks). High protein content for optimal growth.',
                'p_price' => 22.00,
                'p_stock' => 40,
                'p_type' => 'feed',
                'p_rating' => 4.4,
                'p_image' => 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
