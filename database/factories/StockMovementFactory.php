<?php

namespace Database\Factories;

use App\Models\StockMovement;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['entrée', 'sortie', 'ajustement']),
            'quantity' => $this->faker->numberBetween(1, 20),
            'reason' => $this->faker->sentence(),
            'created_at' => now(),
        ];
    }
}
