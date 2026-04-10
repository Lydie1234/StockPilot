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
        return StockMovement::with(['product', 'user'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => ['required', Rule::in(['entrée', 'sortie', 'ajustement'])],
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        if ($validated['type'] === 'sortie' && $product->current_stock < $validated['quantity']) {
            return response()->json(['error' => 'Stock insuffisant pour la sortie.'], 422);
        }

        $validated['user_id'] = Auth::id();
        $movement = StockMovement::create($validated);
        return response()->json($movement->load(['product', 'user']), 201);
    }

    public function show(StockMovement $stockMovement)
    {
        return $stockMovement->load(['product', 'user']);
    }
}
