<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockMovementThresholdTest extends TestCase
{
    use RefreshDatabase;

    public function test_sortie_is_rejected_when_remaining_stock_would_fall_below_threshold(): void
    {
        $user = User::factory()->create(['role' => 'gerant']);
        $product = Product::factory()->create([
            'current_stock' => 10,
            'alert_threshold' => 5,
        ]);

        $response = $this->actingAs($user)->postJson('/api/stock-movements', [
            'product_id' => $product->id,
            'type' => 'sortie',
            'quantity' => 6, 
            'reason' => 'Test seuil minimum',
        ]);

        $response->assertStatus(422);

        $product->refresh();
        $this->assertSame(10, (int) $product->current_stock);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_sortie_is_allowed_when_remaining_stock_equals_threshold(): void
    {
        $user = User::factory()->create(['role' => 'gerant']);
        $product = Product::factory()->create([
            'current_stock' => 10,
            'alert_threshold' => 5,
        ]);

        $response = $this->actingAs($user)->postJson('/api/stock-movements', [
            'product_id' => $product->id,
            'type' => 'sortie',
            'quantity' => 5, 
            'reason' => 'Test seuil minimum',
        ]);

        $response->assertStatus(201);

        $product->refresh();
        $this->assertSame(5, (int) $product->current_stock);

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'user_id' => $user->id,
            'type' => 'sortie',
            'quantity' => 5,
        ]);

        $this->assertSame(1, StockMovement::query()->count());
    }
}
