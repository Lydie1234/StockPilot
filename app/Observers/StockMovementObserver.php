<?php

namespace App\Observers;

use App\Models\StockMovement;

class StockMovementObserver
{
    /**
     * Handle the StockMovement "created" event.
     */
    public function created(StockMovement $stockMovement): void
    {
        $product = $stockMovement->product;

        if ($stockMovement->type === 'entree') {
            $product->increment('current_stock', $stockMovement->quantity);
        }

        if ($stockMovement->type === 'sortie') {
            $product->decrement('current_stock', $stockMovement->quantity);
        }

        if ($stockMovement->type === 'ajustement') {
            $product->update(['current_stock' => $stockMovement->quantity]);
        }

        $product->save();
    }


    /**
     * Handle the StockMovement "updated" event.
     */
    public function updated(StockMovement $stockMovement): void
    {
        //
    }

    /**
     * Handle the StockMovement "deleted" event.
     */
    public function deleted(StockMovement $stockMovement): void
    {
        //
    }

    /**
     * Handle the StockMovement "restored" event.
     */
    public function restored(StockMovement $stockMovement): void
    {
        //
    }

    /**
     * Handle the StockMovement "force deleted" event.
     */
    public function forceDeleted(StockMovement $stockMovement): void
    {
        //
    }
}
