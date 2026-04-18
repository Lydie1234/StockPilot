<?php

namespace App\Models\Observers;

use App\Models\StockMovement;
use App\Models\Product;

class StockMovementObserver
{
    public function created(StockMovement $movement)
    {
        $product = $movement->product;
        if ($movement->type === 'entrée') {
            $product->current_stock += $movement->quantity;
        } elseif ($movement->type === 'sortie') {
            $product->current_stock -= $movement->quantity;
        } elseif ($movement->type === 'ajustement') {
            $product->current_stock = $movement->quantity;
        }
        $product->save();
    }
}
