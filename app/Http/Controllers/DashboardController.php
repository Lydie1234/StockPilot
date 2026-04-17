<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $productsInAlert = Product::belowThreshold()->get();
        $totalStockValue = Product::sum(DB::raw('current_stock * unit_price'));
        $recentMovements = \App\Models\StockMovement::with('product')->latest()->take(10)->get();

        return [
            'products_in_alert' => $productsInAlert,
            'total_stock_value' => $totalStockValue,
            'recent_movements' => $recentMovements,
        ];
    }
}
