<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockMovementErrorMessagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_threshold_error_message_contains_all_details(): void
    {
        $user = User::factory()->create(['role' => 'gerant']);
        $product = Product::factory()->create([
            'current_stock' => 15,
            'alert_threshold' => 8,
        ]);

        $response = $this->actingAs($user)->postJson('/api/stock-movements', [
            'product_id' => $product->id,
            'type' => 'sortie',
            'quantity' => 9, // remaining would be 6 < 8
            'reason' => 'Test seuil minimum',
        ]);

        $response->assertStatus(422);

        // Vérifier que tous les détails sont présents
        $response->assertJsonStructure([
            'error',
            'details',
            'current_stock',
            'alert_threshold',
            'requested_quantity',
            'remaining_after_exit',
        ]);

        // Vérifier les valeurs exactes
        $response->assertJson([
            'error' => 'Cette sortie ferait descendre le stock sous le seuil minimum d\'alerte.',
            'current_stock' => 15,
            'alert_threshold' => 8,
            'requested_quantity' => 9,
            'remaining_after_exit' => 6,
        ]);
    }

    public function test_insufficient_stock_error_message(): void
    {
        $user = User::factory()->create(['role' => 'gerant']);
        $product = Product::factory()->create([
            'current_stock' => 5,
            'alert_threshold' => 2,
        ]);

        $response = $this->actingAs($user)->postJson('/api/stock-movements', [
            'product_id' => $product->id,
            'type' => 'sortie',
            'quantity' => 10, // more than available
            'reason' => 'Test stock insuffisant',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'error' => 'Stock insuffisant.',
        ]);
    }

    public function test_successful_movement_when_above_threshold(): void
    {
        $user = User::factory()->create(['role' => 'gerant']);
        $product = Product::factory()->create([
            'current_stock' => 15,
            'alert_threshold' => 8,
        ]);

        $response = $this->actingAs($user)->postJson('/api/stock-movements', [
            'product_id' => $product->id,
            'type' => 'sortie',
            'quantity' => 5, // remaining would be 10 > 8
            'reason' => 'Test mouvement autorisé',
        ]);

        $response->assertStatus(201);

        $product->refresh();
        $this->assertSame(10, (int) $product->current_stock);
    }

    public function test_movement_exactly_at_threshold_is_allowed(): void
    {
        $user = User::factory()->create(['role' => 'gerant']);
        $product = Product::factory()->create([
            'current_stock' => 15,
            'alert_threshold' => 7,
        ]);

        $response = $this->actingAs($user)->postJson('/api/stock-movements', [
            'product_id' => $product->id,
            'type' => 'sortie',
            'quantity' => 8, // remaining would be 7 == threshold
            'reason' => 'Test au seuil exact',
        ]);

        $response->assertStatus(201);

        $product->refresh();
        $this->assertSame(7, (int) $product->current_stock);
    }
}
