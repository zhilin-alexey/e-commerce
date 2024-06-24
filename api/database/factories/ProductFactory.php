<?php

namespace Database\Factories;

use App\Http\Controllers\CategoryController;
use App\Models\Category;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->realText(20),
            'description' => fake()->realText(100),
            'category_id' => Category::all()->random()->id,
            'price' => fake()->randomFloat(2, 10, 1000000),
            'width' => fake()->randomFloat(2, 0, 1000),
            'height' => fake()->randomFloat(2, 0, 1000),
            'weight' => fake()->randomFloat(2, 0, 1000),
        ];
    }
}
