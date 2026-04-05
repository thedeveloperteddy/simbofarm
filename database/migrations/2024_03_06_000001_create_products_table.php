<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('p_name'); // Product name
            $table->text('p_description'); // Product description
            $table->decimal('p_price', 8, 2); // Product price
            $table->integer('p_stock'); // Stock quantity
            $table->string('p_type'); // Category: eggs, broilers, feed, chicks
            $table->decimal('p_rating', 2, 1)->default(0); // Rating
            $table->string('p_image')->nullable(); // Media/image URL
            $table->timestamp('p_date')->useCurrent(); // Created date as timestamp
            $table->boolean('is_active')->default(true); // Active status
            $table->timestamps();
            
            $table->index(['p_type', 'is_active']);
            $table->index('p_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
