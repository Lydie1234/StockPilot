<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StockMovementController extends Controller
{
    public function index()
    {
        return StockMovement::with(['product', 'user'])->latest()->paginate(50);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => ['required', Rule::in(['entree', 'sortie', 'ajustement'])],
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        
        // ✅ RÈGLE MÉTIER 1: Vérifier que la quantité ne dépasse pas le stock disponible
        if ($validated['type'] === 'sortie') {
            if ($product->current_stock < $validated['quantity']) {
                return response()->json([
                    'error' => 'Stock insuffisant.',
                    'details' => "Stock disponible: {$product->current_stock} unités. Quantité demandée: {$validated['quantity']} unités."
                ], 422);
            }
            
            // ✅ RÈGLE MÉTIER 2: Empêcher une sortie si (stock - quantité) < seuil minimum
            $remaining_stock = $product->current_stock - $validated['quantity'];
            if ($remaining_stock < $product->alert_threshold) {
                return response()->json([
                    'error' => 'Cette sortie ferait descendre le stock sous le seuil minimum d\'alerte.',
                    'details' => "Stock après sortie: {$remaining_stock} unités. Seuil minimum: {$product->alert_threshold} unités.",
                    'current_stock' => $product->current_stock,
                    'alert_threshold' => $product->alert_threshold,
                    'requested_quantity' => $validated['quantity'],
                    'remaining_after_exit' => $remaining_stock
                ], 422);
            }
        }

        // Mettre à jour le stock du produit
        $delta = 0;
        if ($validated['type'] === 'entree') {
            $delta = $validated['quantity'];
            $product->current_stock += $delta;
        } elseif ($validated['type'] === 'sortie') {
            $delta = -$validated['quantity'];
            $product->current_stock += $delta;
        } elseif ($validated['type'] === 'ajustement') {
            $delta = $validated['quantity'] - $product->current_stock;
            $product->current_stock = $validated['quantity'];
        }

        $product->save();

        // Créer le mouvement
        $validated['user_id'] = Auth::id();
        $validated['quantity'] = abs($delta);
        $movement = StockMovement::create($validated);

        return response()->json($movement->load(['product', 'user']), 201);
    }

    public function show(StockMovement $stockMovement)
    {
        return $stockMovement->load(['product', 'user']);
    }
}
